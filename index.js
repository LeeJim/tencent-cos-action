const core = require('@actions/core');
const COS = require('cos-nodejs-sdk-v5')

async function run() {
  try {
    const secretId = core.getInput('secretId');
    const secretKey = core.getInput('secretKey');
    const bucket = core.getInput('bucket');
    const region = core.getInput('region');
    const content = core.getInput('content');

    const name = Date.now() + '-' + Math.ceil(Math.random() * 100)

    core.info(name);

    let body = '';
    if (content.startsWith('data:image')) {
      body = Buffer.from(content.split(',')[1], 'base64');
    } else {
      body = content;
    }
    
    const cos = new COS({
      SecretId: secretId,
      SecretKey: secretKey
    });
    const upload = () => new Promise((resolve, reject) => {
      cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: name,
        Body: body
      }, (err, data) => {
        if (err) reject(err)
        resolve(data.Location)
      })
    })

    const url = await upload()

    core.setOutput('url', url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
