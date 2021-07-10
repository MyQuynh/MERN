import {MicroORM} from "@mikro-orm/core";

const main = async () => {
    const orm = await MicroORM.init({
        entity : [],        
        dbName : "lireddit",
        type : "postgresql",
        debug: process.env.NODE_EVN !== 'production'
    });
};