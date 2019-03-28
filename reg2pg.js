const mqttReg = require("@device.farm/mqtt-reg");

const PgClient = new require("pg").Client;

require("@device.farm/appglue")({ require, file: __dirname + "/config.json" }).main(async config => {

    const siteId = config.siteId;    

    console.info("Connecting to PostgreSQL...");
    const db = new PgClient(config.pg);
    await db.connect();
    console.info("Connected to PostgreSQL");

    let regs = {};
    let last = {};

    mqttReg.mqttAdvertise(config.mqtt, name => {
        if (!regs[name]) {
            console.info("Adding register", name);
            regs[name] = mqttReg.mqttReg(config.mqtt, name, (value, prev, initial) => {});
        }
    });

    let working = false;

    setInterval(async () => {
        try {
            if (!working) {
                working = true;
                for ([name, reg] of Object.entries(regs)) {

                    let value = reg.actual();

                    if (typeof value === "boolean") {
                        value = value ? 1 : 0;
                    }

                    if ((typeof value === "number") || ((value === undefined) && (last[name] !== undefined))) {

                        try {
                            await db.query("insert into regs(time, id_site, reg, value) values(current_timestamp, $1, $2, $3)", [siteId, name, value]);
                        } catch (e) {
                            console.error(`Error inserting ${value} for register ${name} of site ${siteId}:`, e.message || e);
                        }

                        last[name] = value;

                    }
                };
            }
        } finally {
            working = false;
        }
    }, config.intervalMs);

});