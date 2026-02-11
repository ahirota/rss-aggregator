import fs from "fs";
import os from "os";
import path from "path";

const HOME_DIR = os.homedir()
const CONFIG_FILE_NAME = ".gatorconfig.json"

type Config = {
    dbUrl: string,
    currentUserName: string;
}

export function setUser(currentUser: string) {
    const cfg = readConfig();
    cfg.currentUserName = currentUser;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const path = getConfigFilePath();
    const raw = fs.readFileSync(path, 'utf-8');
    const cfg = validateConfig(raw);
    return cfg;
}

// Helper Functions
function getConfigFilePath(): string {
    return path.resolve(path.join(HOME_DIR, CONFIG_FILE_NAME));
}

function writeConfig(cfg: Config): void {
    const path = getConfigFilePath();
    const json_cfg = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    const json = JSON.stringify(json_cfg);
    fs.writeFileSync(path, json);
}

function validateConfig(rawConfig: any): Config {
    const parsed = JSON.parse(rawConfig);

    if (!parsed.db_url || typeof parsed.db_url !== "string" ) {
        throw new Error('Config Database URL Error. Parameter is missing or invalid.');
    }

    if (!parsed.current_user_name || typeof parsed.current_user_name !== "string" ) {
        throw new Error('Config Username Error. Parameter is missing or invalid.');
    }

    const cfg = {
        dbUrl: parsed.db_url,
        currentUserName: parsed.current_user_name
    };

    return cfg;
}