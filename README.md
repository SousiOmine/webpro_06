# webpro_06
## 概要
情報工学科の2S,Webプログラミングの講義の課題として作成したアプリケーションです。  
Webサーバーの機能を持っており、
起動してアクセスすることで複数の簡易的なWebアプリケーションを
使用することができます。  

## 機能一覧
- CPUとユーザーでじゃんけんを行う
- ユーザーの運勢を乱数で占う
- 挨拶を返す
- Appleのロゴを表示する
- うさぎと会話を楽しむ
- 任意の文字列の文字数を確認する

## 使用方法
1. このリポジトリをクローン
1. ```npm install```で依存関係をインストールする
1. ```node app5.js```で起動する
1. 自端末内でサーバーが起動するので、各機能ごとにURLでアクセスする

ただし、[ChatCIT](#chatcit)において言語モデルを利用した高度な会話を行うには、
起動前に[言語モデルのセットアップ](#言語モデルのセットアップ)を行う必要があります。

#### 言語モデルのセットアップ
[ChatCIT](#chatcit)では、大規模言語モデルを用いたAIとの対話機能が実装されています。
ここで用いる言語モデルは本リポジトリに同梱されていないため、
使用する際には利用者自身が用意し、適切な場所に配置する必要があります。
  
言語モデルの必須要件は次の通りです
 - [llama.cpp](https://github.com/ggerganov/llama.cpp)によって量子化されたgguf形式のファイルであること
  
これに加え、推奨する要件を満たすことで、応答の速度、精度の向上が見込めます。
 - パラメータ数が70億以下の比較的軽量なモデルであること
 - 日本語データによって事前学習が行われ、十分な日本語における対話能力を持ったモデルであること
 - 量子化の精度が4bit以上であること

以上の要件を満たすモデルとして、私はGoogleの開発した大規模言語モデル「日本語版 Gemma 2 2B」をおすすめします。  
Gemma2のllama.cpp用量子化済みモデルはインターネット上にて個々人が量子化済みのファイルを配布していたり
（「gemma2 2b jpn it gguf」で検索すると出ます）、
llama.cppを用いて自分で量子化を行うこともできます。  

> [!WARNING]
> Gemma2の利用にはGoogleの定義した利用規約に従う必要がありますので、確認したうえでお試しください。

量子化済みの言語モデルが用意できたら、以下の手順に従いセットアップを行います
1. 言語モデルのファイル名を「llama.gguf」に変更する
1. app5.jsのある階層に、ml_modelという名前でディレクトリを作成する
1. ml_modelディレクトリ内に、llama.ggufを移動させる

以上のセットアップを終えて起動した際に、  
「ggufモデルが配置されていました。読み込みます。」
「言語モデルの読み込みが完了しました。」  
という表示が標準出力に出力されていれば、正常に読み込まれています。

## 各機能ごとの詳細

#### ChatCIT
サーバーを起動した状態で、
http://localhost:8080/chatcit
にアクセスすると使用できます。

![ChatCITのスクリーンショット](https://github.com/user-attachments/assets/2e8bc7fc-d735-423f-825d-71e072fcf633)

対話形式で、うさぎと会話することができます。  
通常のチャットAIと異なり、本機能は対話時のインターネット接続を必要としませんし、外部に情報を送信することもありません。  

> [!NOTE]
> 言語モデルを利用した高度な会話には、[言語モデルのセットアップ](#言語モデルのセットアップ)を行う必要があります。

言語モデルのセットアップを行っていない場合は、うさぎは「はあ...」とだけ返事を返します。  
また「会話履歴を消去」をクリックし、会話をリセットすることができます。


```mermaid
    flowchart TD;

    Start(起動)
    IsExistLLMWeight{もし言語モデルが配置されていれば}
    LoadLLM(言語モデルを読み込み)
    Wait(待ち受け)
    Show(ページ表示)
    GetContext{リクエストから過去の会話履歴と質問を取得}
    IsLoadedLLM{言語モデルが読み込まれていれば}
    kariResponce(はあ...という回答を用意)
    GenerateResponce(言語モデルにより回答を生成)
    InputQuest(ユーザーが質問を入力)


    Start -->IsExistLLMWeight
    IsExistLLMWeight -->|配置されている|LoadLLM
    IsExistLLMWeight -->|配置されていない|Wait
    LoadLLM --> Wait
    Wait -->|ユーザーがchatcitにアクセス|GetContext
    GetContext -->|会話履歴が存在する場合| IsLoadedLLM
    GetContext -->|会話履歴が存在しない場合| Show
    IsLoadedLLM -->|読み込まれている|GenerateResponce
    IsLoadedLLM -->|読み込まれていない|kariResponce
    GenerateResponce -->Show
    kariResponce -->Show
    Show -->Wait
    Show -->InputQuest
    InputQuest -->|会話履歴をリクエストに載せてchatcitにアクセス|GetContext
```

#### 文字数カウント
サーバーを起動した状態で、
http://localhost:8080/char_counter
にアクセスすると使用できます。

![文字数カウントのスクリーンショット](https://github.com/user-attachments/assets/df04bfa6-bc4b-4f10-8605-fb2b53fccc16)

入力欄に文字列を入力し「送信」ボタンを押すと、
入力した文字列の文字数を表示します。

```mermaid
    flowchart TD;

    Start(起動)
    Show(表示)
    Wait(待ち受け)
    IsHavingInput{リクエストにテキストが含まれているか}
    Count(文字数をカウント)
    UserInput(文字数を数えたいテキストを入力)

    Start --> Wait
    Wait -->|ユーザーがchar_counterにアクセス|IsHavingInput
    IsHavingInput -->|テキストが含まれている|Count
    Count -->Show
    IsHavingInput -->|テキストが含まれていない|Show
    Show -->UserInput
    UserInput -->|テキストをリクエストに載せてchar_counterにアクセス|IsHavingInput

```

#### じゃんけん
サーバーを起動した状態で、
http://localhost:8080/janken
にアクセスすると使用できます。


![じゃんけんのスクリーンショット](https://github.com/user-attachments/assets/4886cf59-8f46-4eec-b673-6fe91edeff62)

入力欄に"グー"、"チョキ"、"パー"のいずれかを入力して送信ボタンを押すことによって、
CPUとのじゃんけん対戦を行えます。


#### 運勢占い
サーバーを起動した状態で、
http://localhost:8080/luck
にアクセスすると使用できます。

![運勢占いのスクリーンショット](https://github.com/user-attachments/assets/63724718-b8f2-41b0-b804-486d309318eb)

それぞれ6分の1の確率で大吉と中吉、残り3分の2の確率で小吉が出ます。


#### 挨拶を返す
サーバーを起動した状態で、
http://localhost:8080/hello1
もしくは
http://localhost:8080/hello2
にアクセスすると表示できます。

![挨拶のスクリーンショット](https://github.com/user-attachments/assets/18cd8fe9-b955-4350-af8c-0f95c703c994)

英語とフランス語による挨拶を表示します。

#### Appleのロゴを表示
サーバーを起動した状態で、
http://localhost:8080/icon
にアクセスすると表示できます。

![ロゴ表示のスクリーンショット](https://github.com/user-attachments/assets/62c647d1-fadf-4780-99ca-c6a6e5b86111)


Appleのロゴを表示します。

## 今後の更新予定
ある
