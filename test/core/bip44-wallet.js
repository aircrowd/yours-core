/* global describe,it */
'use strict'
let Address = require('fullnode/lib/address')
let BIP44Account = require('../../core/bip44-account')
let BIP44Wallet = require('../../core/bip44-wallet')
let asink = require('asink')
let should = require('should')

describe('BIP44Wallet', function () {
  it('should exist', function () {
    should.exist(BIP44Wallet)
    should.exist(BIP44Wallet())
  })

  describe('#asyncFromRandom', function () {
    it('should generate a random wallet', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        should.exist(bip44wallet.mnemonic)
        should.exist(bip44wallet.masterxprv)
        should.exist(bip44wallet.masterxpub)

        let entropybuf = new Buffer(16)
        entropybuf.fill(0)
        bip44wallet = yield BIP44Wallet().asyncFromRandom(entropybuf)
        bip44wallet.mnemonic.toString().should.equal('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about')
      })
    })
  })

  describe('#toJSON', function () {
    it('should convert to JSON', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        yield bip44wallet.asyncGetNewAddress(0)
        yield bip44wallet.asyncGetNewAddress(0)
        let json = bip44wallet.toJSON()
        should.exist(json.mnemonic)
        should.exist(json.masterxprv)
        should.exist(json.masterxpub)
        should.exist(json.bip44accounts)
        Object.keys(json.bip44accounts).length.should.greaterThan(0)
      })
    })
  })

  describe('#fromJSON', function () {
    it('should round trip with .toJSON', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        yield bip44wallet.asyncGetNewAddress(0)
        yield bip44wallet.asyncGetNewAddress(0)
        let json = bip44wallet.toJSON()
        let bip44wallet2 = BIP44Wallet().fromJSON(json)
        should.exist(bip44wallet2.mnemonic)
        should.exist(bip44wallet2.masterxprv)
        should.exist(bip44wallet2.masterxpub)
        should.exist(bip44wallet2.bip44accounts)
        bip44wallet2.bip44accounts.size.should.greaterThan(0)
      })
    })
  })

  describe('#asyncGetPrivateAccount', function () {
    it('should generate a random wallet', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        let bip44account = yield bip44wallet.asyncGetPrivateAccount(0)
        ;(bip44account instanceof BIP44Account).should.equal(true)
        bip44account = yield bip44wallet.asyncGetPrivateAccount(1)
        ;(bip44account instanceof BIP44Account).should.equal(true)
      })
    })
  })

  describe('#asyncGetNewAddress', function () {
    it('should return a new address', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        let address = yield bip44wallet.asyncGetNewAddress(0)
        ;(address instanceof Address).should.equal(true)
      })
    })
  })

  describe('#asyncGetNewChangeAddress', function () {
    it('should return a new address', function () {
      return asink(function *() {
        let bip44wallet = yield BIP44Wallet().asyncFromRandom()
        let address = yield bip44wallet.asyncGetNewChangeAddress(0)
        ;(address instanceof Address).should.equal(true)
      })
    })
  })
})