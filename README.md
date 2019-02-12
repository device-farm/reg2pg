# Raspi installation

```
docker run --name reg2pg --restart=always -d -e DF_LOGGER_PASSWORD=xxx -e DF_SITE_ID=xxx -e APP_START="node reg2pg.js" -e MQTT=10.1.0.12 -e REPOSITORY=https://github.com/device-farm/reg2pg burgrp/npg-rpi
```