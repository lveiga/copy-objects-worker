const s3 = require('aws-sdk');
const neatCsv = require('neat-csv') 
const Bluebird = require('bluebird')


const extractStorageMetadata = ({ Records }) => {
    const { s3 } = Records[0]
    const { object, bucket } = s3
    return {     
        key: object.key,
        bucket: bucket.name
    }
}

const mapStoragePaths = collection => [...new Set(collection.map(item => `${Object.values(item).join('X').replace('-', 'X')}_5.pdf`))]


const copyFile = key => {
    const params = {
        CopySource: srcBucket + '/' + key,
        Bucket: dstBucket,
        Key: key
    };
    return Bluebird.resolve(params)
        .then(s3.copyObject(params).promise())
        .then(() => console.log('arquivo ' + params.key + ' foi movido com sucesso!'))
}

const copyAllFiles = keys => keys.map(item => copyFile(item))

const downloadFile = ({ bucket, key }) => s3Service.getObject({
    Bucket: bucket,
    Key: key
})
.promise()
.then(({ Metadata, Body }) => ({ Metadata, Body, filename: basename(key) }))



const processFile = messageSQS => {
    return Bluebird.resolve(fileBuffer.Records[0])
        .then(downloadFile)
        .then(neatCsv.parseFile)
        .then(mapStoragePaths)
        .then(copyAllFiles)
}

module.exports = {
    processFile
}