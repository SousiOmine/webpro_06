import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class Llama {
    llama;
    model;
    session;
    constructor()
    {
        
    }

    async LoadModel(Model_name)
    {
        this.llama = await getLlama();
        this.model = await this.llama.loadModel({
            modelPath: path.join(__dirname, "ml_model", Model_name),
        });
    }

    async CreateSession(system_prompt)
    {
        let context = await this.model.createContext();
        this.session = new LlamaChatSession({
            contextSequence: context.getSequence(),
        });
        await this.session.prompt(system_prompt);
    }

    async Chat(message)
    {
        let result = await this.session.prompt(message);
        return result;
    }
}