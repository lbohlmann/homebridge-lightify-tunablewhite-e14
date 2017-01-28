# homebridge-lightify-tunablewhite-e14
Simple workaround to use Lightify's "Tunable White" lamps with homebridge.

Sample config.json for homebridge:
    {
        "bridge": {
            "name": "Homebridge",
            "username": "CC:22:3D:E3:CE:30",
            "port": 51826,
            "pin": "031-45-154"
        },

        "description": "Config for homebridge-lightify-tunablewhite-e14",

        "accessories": [
            {
                "accessory": "LightifyBulb",
                "name": "Lamp 1",
                "ip": "ip.of.gate.way",
                "mac": "mac.address.of.lamp"
            },
            {
                "accessory": "LightifyBulb",
                "name": "Lamp 2",
                "ip": "ip.of.gate.way",
                "mac": "mac.address.of.lamp"
            }
        ]
    }

