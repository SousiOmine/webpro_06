import { Llama } from "./llama.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Console } from "console";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let usellama_flag = false;
let chatai = null;
let system_prompt = "[System]あなたは千葉工業大学の対話型AI「うさぎ」です。回答はmarkdownではなくHTMLで出力しなさい。また改行には <br> タグを用い、回答の末尾には必ず改行すること。ただし、回答の始めには改行しないようにしてください。";
system_prompt += "千葉工業大学は1942年に設立された私立大学で、現在日本で最も入試者数の多い大学です。「うさぎ」は千葉工業大学のマスコットキャラクターの「チバニー」です。"
system_prompt += "「うさぎ」は、敬語ではなく常にタメ口で話します。またそっけなく、愛想もないうえにろくな情報を喋りません。";

if (fs.existsSync(path.join(__dirname, "ml_model", "llama.gguf")))
{
  usellama_flag = true;
  console.log("ggufモデルが配置されていました。読み込みます。");
  chatai = new Llama();
  await chatai.LoadModel("llama.gguf");
  await chatai.CreateSession(system_prompt);
  console.log("言語モデルの読み込みが完了しました。");
}
else 
{
  console.log("ggufモデルが配置されていないため、chatcitの応答に言語モデルは使用されません。");  
}

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/chatcit", async(req, res) => {
  let user_message = req.query.usr_message;
  let talk = req.query.before_talk;

  if (user_message == undefined && talk == undefined) {
    res.render("chatcit", { talk: " " });
    if (usellama_flag) chatai.CreateSession(system_prompt);
    return;
  }
  if (talk == undefined) talk = "";

  let this_turn_quest = "";
  this_turn_quest += "ユーザー< ";
  this_turn_quest += user_message + " <br>";
  this_turn_quest += "うさぎ<"

  talk += this_turn_quest;

  let ai_responce = "";

  if (usellama_flag)
  {
    ai_responce = await chatai.Chat(this_turn_quest);
  }
  else
  {
    ai_responce = "はあ...<br>";  
  }

  talk += ai_responce;

  const res_talk = {
    talk: talk
  };
  res.render('chatcit', res_talk);
});

app.get("/char_counter", (req, res) => {
  let usr_text = req.query.usr_text;

  if (usr_text == undefined) usr_text = "";

  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const count = [...segmenter.segment(usr_text)].length;

  res.render("char_counter", {count: count})
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  if (req.query.win == undefined) win = 0;
  let total = Number(req.query.total);
  if (req.query.total == undefined) total = -1;
  console.log({ hand, win, total });
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  let judgement = '';
  switch (cpu) {
    case 'グー':
      if (hand == 'グー')
        judgement = 'あいこ';
      else if (hand == 'チョキ')
      {
        judgement = "負け";
      }
      else if (hand == 'パー')
      {
        judgement = "勝ち";
        win++;
      }
      break;
    
    case 'チョキ':
      if (hand == 'グー')
      {
        judgement = '勝ち';
        win++;
      }
      else if (hand == 'チョキ')
      {
        judgement = "あいこ";
      }
      else if (hand == 'パー')
      {
        judgement = "負け";
      }
      break;
    
      case 'パー':
        if (hand == 'グー')
        {
          judgement = '負け';
        }
        else if (hand == 'チョキ')
        {
          judgement = "勝ち";
          win++;
        }
        else if (hand == 'パー')
        {
          judgement = "あいこ";
        }
        break;
  }
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
