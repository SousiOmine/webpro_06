const express = require("express");
const app = express();

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

app.get("/chatcit", (req, res) => {
  let user_message = req.query.usr_message;
  let talk = req.query.before_talk;

  if (user_message == undefined && talk == undefined) {
    res.render("chatcit", { talk: " " });
    return;
  }
  if (talk == undefined) talk = "";

  talk += "ユーザー< ";
  talk += user_message + "<br>";

  const res_talk = {
    talk: talk
  };
  res.render('chatcit', res_talk);
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
        judgement == "負け";
      }
      else if (hand == 'パー')
      {
        judgement == "勝ち";
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
        judgement == "あいこ";
      }
      else if (hand == 'パー')
      {
        judgement == "負け";
      }
      break;
    
      case 'パー':
        if (hand == 'グー')
        {
          judgement = '負け';
        }
        else if (hand == 'チョキ')
        {
          judgement == "勝ち";
          win++;
        }
        else if (hand == 'パー')
        {
          judgement == "あいこ";
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
