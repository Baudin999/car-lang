import { ModuleDictionary } from "./ModuleDictionary";
import { IConfiguration } from "./helpers";
/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */
export declare class Project {
    projectDirectory: string;
    configPath: string;
    outPath: string;
    versionPath: string;
    preludePath: string;
    indexPath: string;
    config: IConfiguration;
    constructor(projectDirectory: string);
    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify(): Promise<Project>;
    init(): Promise<boolean>;
    compile(): Promise<ModuleDictionary> | undefined;
    watch(): void;
}
export declare const styleCSS = "\n/* RESET */\n\n*,\n*:before,\n*:after {\n    box-sizing: border-box;\n}\n\nhtml,\nbody {\n    font-family: \"Roboto\", \"Verdana\", sans-serif;\n    margin: 0;\n    padding: 0;\n    position: relative;\n    height: 100%;\n    width: 100%;\n}\n\nbody {\n    overflow: auto;\n    /*background: rgb(240, 240, 240);*/\n    padding: 1rem;\n}\n\np {\n    text-align: justify;\n}\n\n/*\n.page {\n    width: 21cm;\n    min-height: 100%;\n    left: 50%;\n    transform: translateX(-50%);\n    background: white;\n    padding: 1rem;\n    position: absolute;\n    border: 1px solid lightgray;\n    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);\n}\n*/\n\ntable a:link {\n    color: #666;\n    font-weight: bold;\n    text-decoration: none;\n}\ntable a:visited {\n    color: #999999;\n    font-weight: bold;\n    text-decoration: none;\n}\ntable a:active,\ntable a:hover {\n    color: #bd5a35;\n    text-decoration: underline;\n}\ntable {\n    width: 100%;\n    font-family: Arial, Helvetica, sans-serif;\n    color: #666;\n    font-size: 12px;\n    text-shadow: 1px 1px 0px #fff;\n    background: #eaebec;\n    border: #ccc 1px solid;\n\n    -moz-border-radius: 3px;\n    -webkit-border-radius: 3px;\n    border-radius: 3px;\n\n    -moz-box-shadow: 0 1px 2px #d1d1d1;\n    -webkit-box-shadow: 0 1px 2px #d1d1d1;\n    box-shadow: 0 1px 2px #d1d1d1;\n    margin-bottom: 2rem;\n\n    page-break-inside: avoid;\n}\ntable th {\n    text-align: center;\n    padding: 3px;\n    border-top: 1px solid #fafafa;\n    border-bottom: 1px solid #e0e0e0;\n\n    background: #ededed;\n    background: -webkit-gradient(linear, left top, left bottom, from(#ededed), to(#ebebeb));\n    background: -moz-linear-gradient(top, #ededed, #ebebeb);\n}\ntable th:first-child {\n    text-align: left;\n    padding-left: 20px;\n}\ntable tr:first-child th:first-child {\n    -moz-border-radius-topleft: 3px;\n    -webkit-border-top-left-radius: 3px;\n    border-top-left-radius: 3px;\n}\ntable tr:first-child th:last-child {\n    -moz-border-radius-topright: 3px;\n    -webkit-border-top-right-radius: 3px;\n    border-top-right-radius: 3px;\n}\ntable tr {\n    text-align: left;\n    padding-left: 20px;\n}\ntable td:first-child {\n    text-align: left;\n    padding-left: 20px;\n    border-left: 0;\n}\ntable td {\n    border-top: 1px solid #ffffff;\n    border-bottom: 1px solid #e0e0e0;\n    border-left: 1px solid #e0e0e0;\n\n    background: #fafafa;\n    background: -webkit-gradient(linear, left top, left bottom, from(#fbfbfb), to(#fafafa));\n    background: -moz-linear-gradient(top, #fbfbfb, #fafafa);\n    padding: 3px 15px;\n}\ntable tr.even td {\n    background: #f6f6f6;\n    background: -webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#f6f6f6));\n    background: -moz-linear-gradient(top, #f8f8f8, #f6f6f6);\n}\ntable tr:last-child td {\n    border-bottom: 0;\n}\ntable tr:last-child td:first-child {\n    -moz-border-radius-bottomleft: 3px;\n    -webkit-border-bottom-left-radius: 3px;\n    border-bottom-left-radius: 3px;\n}\ntable tr:last-child td:last-child {\n    -moz-border-radius-bottomright: 3px;\n    -webkit-border-bottom-right-radius: 3px;\n    border-bottom-right-radius: 3px;\n}\ntable tr:hover td {\n    background: #f2f2f2;\n    background: -webkit-gradient(linear, left top, left bottom, from(#f2f2f2), to(#f0f0f0));\n    background: -moz-linear-gradient(top, #f2f2f2, #f0f0f0);\n}\n.image-container {\n    max-width: 100%;\n}\n.image-container img {\n    max-width: 100%;\n}\n";
