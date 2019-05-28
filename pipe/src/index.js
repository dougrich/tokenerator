const { MongoClient } = require('mongodb')
const Firestore = require('@google-cloud/firestore')
const shortid = require('shortid')

const firestore = new Firestore()

async function delay(delayMs) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delayMs)
  })
}

function xmur3(str) {
  for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = h << 13 | h >>> 19;
  return function() {
      h = Math.imul(h ^ h >>> 16, 2246822507);
      h = Math.imul(h ^ h >>> 13, 3266489909);
      return ((h ^= h >>> 16) >>> 0);
  }
}


async function pipecollection(db, from, to) {
  const batchSize = 1000
  let batchSkip = 0
  let hasNext = true
  while (hasNext) {
    console.log(from + ' Starting batch')
    const cursor = db.collection(from).find().skip(batchSkip * batchSize).limit(batchSize)
    let next = await cursor.nextObject()
    let i = 0
    while (next != null) {
      const instance = next
      delete instance._id
      delete instance.cssId
      instance.legacyid = instance.id
      instance.private = !!instance.private
      if (instance.user) {
        // lookup user
        const user = await db.collection('users').findOne({ id: instance.user })
        if (user) {
          if (user.provider === 'windowslive') {
            user.provider = 'microsoft'
          }
          instance.user = user.provider + '/' + instance.user
        } else {
          instance.user = null
        }
      } else {
        instance.user = null
      }
      const seed = xmur3(instance.id.repeat(20))()
      shortid.seed(seed)
      instance.id = shortid()
      const document = firestore.doc(to + '/' + instance.id)
      await document.set(instance)

      next = await cursor.nextObject()
      i++
      if ((i % 100) === 0) {
        console.log(from + ' ... ' + (i + batchSkip * batchSize))
      }
      await delay(1)
    }
    if (i !== batchSize) {
      hasNext = false
    }
    batchSkip++

    console.log(from + ' Completed batch, re-acquiring cursor')
    await delay(1000)
  }
}

async function pipeusers(db) {
  console.log('STARTING PIPE USERS')
  return pipecollection(db, 'users', 'users')
}

async function pipetokens(db) {
  console.log('STARTING PIPE COLLECTIONS')
  return pipecollection(db, 'tokens', 'tokens')
}

async function pipe() {
  const db = await MongoClient.connect(process.env.MONGO_ENDPOINT)
  console.log('Connected to Mongo')
  try {
    await Promise.all([
      pipetokens(db)
    ])
  } catch (err) {
    console.error(err)
  }
  console.log('Disconnecting from Mongo')
  await db.close()
}

async function poll(behavior, delay) {
  try {
    await behavior()
  } catch (err) {
    console.error(err)
  }
  console.log('Waiting ' + delay + 'ms ')
  setTimeout(poll, delay, behavior, delay)
}

poll(pipe, 1000 * 60 * 60 * 24)