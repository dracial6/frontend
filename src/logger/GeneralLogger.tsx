class GeneralLogger {
    static debug(message: any): void {
        console.log("Debug : " + message);
    }

    static info(message: any): void {
        console.log("Info : " + message);
    }

    static warn(message: any): void{
        console.log("Warn : " + message);
    }

    static error(message: any): void {
        console.log("Error : " + message);
    }

    static fatal(message: any): void {
        console.log("Fatal : " + message);
    }
}

export default GeneralLogger;