// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ecc         = require('eosjs-ecc'),
      util        = {}

let   errors      = [],
      tries       = 0

util.genKeyPair = () => {
  return ecc.randomKey().then( wif => {
    let privkey = wif
    let pubkey = ecc.privateToPublic(wif)

    let pubkeyError = null
    try {
      ecc.PublicKey.fromStringOrThrow(pubkey)
    } catch(error) {
      console.log('pubkeyError', error, pubkey)
      pubkeyError = error.message + ' => ' + pubkey
    }

    let privkeyError = null
    try {
      let pub2 = ecc.PrivateKey.fromWif(privkey).toPublic().toString()
      if(pubkey !== pub2)
        throw {message: 'public key miss-match: ' + pubkey + ' !== ' + pub2}
    } catch(error) {
      console.log('privkeyError', error, privkey)
      privkeyError = error.message + ' => ' + privkey
    }

    if(privkeyError || pubkeyError) {
      tries++
      genKeyPair()
    }

    if(tries > 3) {
       alert("there was an error. please send populated details below to devs")
       return { public: privkeyError, private: privkeyError}
    }

    return { public: pubkeyError, private: privkey }
  })
}

util.isPublicKey = publicKey => {
  return ecc.PublicKey.fromString(publicKey) != null
}

util.publicKeyFromPrivateKey = privateKey => {
  return ecc.PrivateKey.fromWif(privateKey).toPublic().toString()
}

util.keygenFailure = (Pk, pk, pubkeyError, privkeyError) => {
  //show error
  //show this information tell them to share {Pk, pk, pubkeyError, privkeyError}
}

util.validateKeypair = (pub, priv) => {
  let valid = false
  try {
    valid = (pub == util.publicKeyFromPrivateKey(priv))
  } catch(e) {
    console.log(e)
  }
  return valid;
}

module.exports = util
