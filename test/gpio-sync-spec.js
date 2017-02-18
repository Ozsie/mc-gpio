var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var gpio = require('./../gpio');
var fs = require('fs');

describe('GPIO', function() {
  afterEach(function() {
    gpio.settings.path = "/sys/class/gpio/";

    if (fs.existsSync("./gpio/gpio1/")) {
      if (fs.existsSync("./gpio/gpio1/direction")) {
        fs.unlinkSync("./gpio/gpio1/direction");
      }
      fs.rmdirSync("./gpio/gpio1");
    }
    if (fs.existsSync("./gpio/")) {
      if (fs.existsSync("./gpio/export")) {
        fs.unlinkSync("./gpio/export");
      }
      if (fs.existsSync("./gpio/unexport")) {
        fs.unlinkSync("./gpio/unexport");
      }
      fs.rmdirSync("./gpio/");
    }
  });

  it('sync.openPin should throw error when export file is not available', function() {
    expect(gpio.sync.openPin.bind(undefined, 0, "out")).to.throw('Could not open pin 0');
  });

  it('sync.openPin should return error when gpio file is not available', function() {
    gpio.settings.path = "./gpio/";
    fs.mkdir(gpio.settings.path);
    fs.writeFile(gpio.settings.path + "export", "1");
    expect(gpio.sync.openPin.bind(undefined, 1, "out")).to.throw('Could not open pin 1');
  });

  it('sync.openPin should not throw any errors when all files are available', function() {
    gpio.settings.path = "./gpio/";
    fs.mkdirSync(gpio.settings.path);
    fs.writeFileSync(gpio.settings.path + "export", "0");
    fs.mkdirSync(gpio.settings.path + "gpio1");
    fs.writeFile(gpio.settings.path + "gpio1/direction", "in");
    expect(gpio.sync.openPin.bind(undefined, 1, "out")).to.not.throw;
  });

  it('sync.closePin should return error when gpio file is not available', function() {
    expect(gpio.sync.closePin.bind(undefined, 0)).to.throw("Could not close pin 0");
  });
});