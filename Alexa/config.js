var config = {};

config.host = "[YOUR AWS IOT HOST].iot.us-east-1.amazonaws.com";
config.topic = "$aws/things/[YOUR THING NAME]/shadow/update";
config.app_id = "amzn1.echo-sdk-ams.app.[YOUR APP ID]"

module.exports = config;
