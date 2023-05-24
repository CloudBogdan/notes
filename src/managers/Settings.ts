import State from "../states/State";
import Storage from "./Storage";

export interface ISettingsData {
    autoSave: boolean
}
interface ISettings {
    [key: string]: State<any>
}

export default class Settings {
    static settings = {
        AutoSave: new State<boolean>("settings/auto-save", true)
    }

    static init() {
        this.load();
    }

    //
    static isSettingActive(settingName: keyof typeof Settings["settings"]): boolean {
        return this.settings[settingName].value || false;
    }
    static toggleSetting(settingName: keyof typeof Settings["settings"]) {
        if (!this.settings[settingName]) return;
        
        this.settings[settingName].set(old=> !old);
        this.save();
    }
    static setSetting(settingName: keyof typeof Settings["settings"], value: any) {
        if (!this.settings[settingName]) return;
        
        this.settings[settingName].value = value;
        this.save();
    }

    static load() {
        const data = Storage.loadItem<ISettingsData>("settings");
        if (data)
            this.loadData(data);
    }
    static save() {
        Storage.saveItem("settings", this.getData());
    }
    
    // Data
    static loadData(data: ISettingsData) {
        if (data.autoSave !== undefined)
            this.settings.AutoSave.value = data.autoSave;
    }
    static getData(): ISettingsData {
        return {
            autoSave: this.settings.AutoSave.value
        }
    }
}