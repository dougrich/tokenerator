const program = require('commander')
const es = require('@elastic/elasticsearch')
const Firestore = require('@google-cloud/firestore')
const path = require('path')

program
  .command('export')
  .description('Exports tokens to an elasticsearch instance for deeper analysis')
  .arguments('<elasticsearch-url>')
  .action(async function (esurl) {
    const projectId = program.project || 'rpg-dougrich-net'
    const firestore = new Firestore({
      projectId,
      keyFilename: path.resolve(__dirname, '../../../creds.json')
    })

    let esqueue = []
    const flushqueue = async () => {
      if (esqueue.length <= 10) {
        return
      }
      const buffer = esqueue
      esqueue = []
      const commands = []
      for (const b of buffer) {
        commands.push({
          create: { _index: 'tokens', _id: b.id }
        })
        commands.push(b)
      }
      await esclient.bulk({
        index: 'tokens',
        type: 'token',
        body: commands
      })
    }

    const esclient = new es.Client({ node: esurl })
    const seenUsers = {}
    firestore.collection('tokens')
      .orderBy('modified')
      .stream()
      .on('data', async (snapshot) => {
        const d = await snapshot.data()
        const isReturning = !!d.user
          ? !!seenUsers[d.user]
          : undefined
        const provider = !!d.user
          ? d.user.split('/')[0]
          : undefined
        const analyticsDocument = {
          created: new Date(d.modified).toISOString(),
          isLegacy: !!d.legacyid,
          isPrivate: !!d.private,
          isDescribed: !!d.description,
          isTitled: !!d.title,
          isAnonymous: !d.user,
          isReturning,
          user: d.user,
          provider,
          parts: d.parts.map(x => x.id),
          partCount: d.parts.length,
          id: d.id
        }
        seenUsers[d.user] = true
        esqueue.push(analyticsDocument)
        await flushqueue()
      })
      .on('end', async () => {
        console.log('COMPLETED')
        await flushqueue()
      })
  })