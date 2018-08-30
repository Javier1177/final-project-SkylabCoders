'use strict'
require ('dotenv').config()


const { logic } = require('.')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { models: {Product, User, Bid} } = require('../data')


const { env: { MONGO_URL } } = process

describe('logic', () => {
    let _connection
    
    const email = 'javier@gmail.com', password = '123', name = 'Javi', surname = 'Lopez', role = 'client'
    
    before(() => 
        mongoose.connect(MONGO_URL, { useNewUrlParser: true })
            .then(conn => _connection = conn)
    )


    beforeEach(() => {
        return Promise.all([Product.remove(), User.remove(), Bid.remove()])
    })

    !true && describe('register user', () => {
        it('should register correctly', () =>
            User.findOne({ email })
                .then(user => {
                    expect(user).to.be.null

                    return logic.register(email, password, name, surname)
                })
                .then(res => {
                    expect(res).to.be.true
        
                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.password).to.equal(password)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    return User.find()
                })
        )

        it('should fail on trying to register an already registered user', () =>
            User.create({ email, password, name, surname })
                .then(() => {
                    return logic.register(email, password, name, surname)
                })
                .catch(err => err )
                .then(({ message }) => expect(message).to.equal(`${email} already exists`))
        )

        it('should fail on trying to register with an undefined email', () =>
            logic.register(undefined, password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with an empty email', () =>
            logic.register('', password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with a numeric email', () =>
            logic.register(123, password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with a space as email', () =>
            logic.register(' ', password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with a space on the start of the email', () =>
            logic.register(' '+email, password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with a space on the end of the email', () =>
            logic.register(email+' ', password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to register with an undefined password', () =>
            logic.register(email, undefined, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to register with an empty password', () =>
            logic.register(email, '', name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to register with a numeric password', () =>
            logic.register(email, 123, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to register with a space as password', () =>
            logic.register(email, ' ', name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to register with a space at the begining of the password', () =>
            logic.register(email, ' '+password, name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to register with a space at the end of the password', () =>
            logic.register(email, password+' ', name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )


        it('should fail on trying to register with an undefined name', () =>
            logic.register(email, password, undefined, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )

        it('should fail on trying to register with an empty name', () =>
            logic.register(email, password, '', surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )

        it('should fail on trying to register with a numeric name', () =>
            logic.register(email, password, 123, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )

        it('should fail on trying to register with a space as name', () =>
            logic.register(email, password, ' ', surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )

        it('should fail on trying to register with a space at the begining of the name', () =>
            logic.register(email, password, ' '+name, surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )

        it('should fail on trying to register with a space at the end of the name', () =>
            logic.register(email, password, name+' ', surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid name'))
        )


        it('should fail on trying to register with an undefined surname', () =>
            logic.register(email, password, name, undefined)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

        it('should fail on trying to register with an empty surname', () =>
            logic.register(email, password, name, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

        it('should fail on trying to register with a numeric surname', () =>
            logic.register(email, password, name, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

        it('should fail on trying to register with a space as surname', () =>
            logic.register(email, password, name, ' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

        it('should fail on trying to register with a space at the begining of the surname', () =>
            logic.register(email, password, name, ' '+surname)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

        it('should fail on trying to register with a space at the end of the surname', () =>
            logic.register(email, password, name, surname+' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid surname'))
        )

    })

    !true && describe('authenticate', () =>{
        const notExistingEmail = 'jlb@gmail.com', incorrectPassword = '123456', email= 'javier@gmail.com', password = '123', name = 'Javi', surname = 'Lopez'


        beforeEach(() => User.create({ email, password, name, surname }))

        it('should login correctly', () =>
            logic.authenticate(email, password)
                .then(res => {
                    expect(res).to.be.true
                })
        )

        it('should fail on trying to login with an undefined email', () =>
            logic.authenticate(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to login with an empty email', () =>
            logic.authenticate('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to login with a numeric email', () =>
            logic.authenticate(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to login with a username', () =>
            logic.authenticate('jlb', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to login with a space as email', () =>
            logic.authenticate(' ', password)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to login with a not existing email', () =>
            logic.authenticate(notExistingEmail, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`${notExistingEmail} does not exists`))
        )

        it('should fail on trying to login with an undefined password', () =>
            logic.authenticate(email, undefined)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to login with an empty password', () =>
            logic.authenticate(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to login with a numeric password', () =>
            logic.authenticate(email, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))
        )

        it('should fail on trying to login without a string as a password', () =>
            logic.authenticate(email, ' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to login with an incorrect password', () =>
        logic.authenticate(email, incorrectPassword)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('wrong password'))
    )

    })

    !true && describe('update password', () => {
        const newPassword = '123456', notExistingEmail = 'jlb@gmail.com', email= 'javier@gmail.com', password = '123', name = 'Javi', surname = 'Lopez', wrongPassword = '987'


        beforeEach(() => User.create({ email, password, name, surname }))

        it('should update password correctly', () =>
            logic.updatePassword(email, password, newPassword)
                .then(res => {
                    expect(res).to.be.true

                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.password).to.equal(newPassword)
                })
        )

        it('should fail on trying to update a password with an undefined new password', () =>
            logic.updatePassword(email, password, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update a password with a numeric new password', () =>
            logic.updatePassword(email, password, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update a password with a new pasword starting with a space', () =>
            logic.updatePassword(email, password, ' '+newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update a password with a new pasword ending with a space', () =>
            logic.updatePassword(email, password, newPassword+' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update a password with a space as a new password', () =>
            logic.updatePassword(email, password, ' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update a password with an empty new password', () =>
            logic.updatePassword(email, password, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid new password'))
        )

        it('should fail on trying to update password with the same password', () =>
            logic.updatePassword(email, password, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('new password must be different'))
        )

        it('should fail on trying to update password with an undefined email', () =>
            logic.updatePassword(undefined, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with an empty email', () =>
            logic.updatePassword('', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with a numeric email', () =>
            logic.updatePassword(123, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with a space as email', () =>
            logic.updatePassword(' ', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with an email that starts with space', () =>
            logic.updatePassword(' '+email, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with an email that starts with space', () =>
            logic.updatePassword(email+' ', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to update password with an email that does not exist', () =>
            logic.updatePassword(notExistingEmail, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`${notExistingEmail} does not exists`))
        )

        it('should fail on trying to update password with an undefined password', () =>
            logic.updatePassword(email, undefined, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with an empty password', () =>
            logic.updatePassword(email, '', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with a numeric password', () =>
            logic.updatePassword(email, 123, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with a space as a password', () =>
            logic.updatePassword(email, ' ', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with a password that starts with space', () =>
            logic.updatePassword(email, ' '+password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with a password that ends with space', () =>
            logic.updatePassword(email, password+' ', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update password with a password that ends with space', () =>
        logic.updatePassword(email, wrongPassword, newPassword)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('wrong password'))
    )
    })

    !true && describe('list user bids', () => {
        const user = new User({ email, password, role, name, surname })

        const bid = new Bid({price: 500, date: new Date(), user: user._id})
        const bid2 = new Bid({price: 690, date: new Date(), user: user._id})

        const product = new Product({
            title: 'Thanos infinity gauntlet',
            description: 'Original gauntlet used on the movie infinity war, whit all the infinit stones',
            initialDate: '2018-08-27T10:18:00',
            finalDate: '2018-08-30T10:18:00',
            initialPrice: 800,
            closed: false,
            image: 'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
            category: 'Marvel',
            bids: [bid, bid2]
        })

        user.bidded.push(product._id)

        beforeEach(() =>
           Promise.all([
               user.save(),
               bid.save(),
               product.save()
           ])
        )

        it('should list user products correctly', () => {
            return logic.listUserBids(user._id)
                .then(products => {
                    expect(products[0].title).to.equal('Thanos infinity gauntlet')
                    expect(products[0].closed).to.be.false
                    expect(products[0].initialPrice).to.equal(800)
                })
        })

        it('should fail at showing user products of a user that does not exist', () => {
            return logic.listUserBids(user._id)
                .catch(err => err)
                .then(({message}) => expect(message).to.equal(`user does not exist`))
        })
    })

    !true && describe('list user wishes', () => {
        const user = new User({ email, password, role, name, surname})

        const product = new Product({
            title: 'Thanos infinity gauntlet',
            description: 'Original gauntlet used on the movie infinity war, whit all the infinit stones',
            initialDate: '2018-08-27T10:18:00',
            finalDate: '2018-08-30T10:18:00',
            initialPrice: 800,
            closed: false,
            image: 'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
            category: 'Marvel',
            bids: []
        })

        user.wishes.push(product._id)


        beforeEach(() =>
           Promise.all([
               user.save(),
               product.save()
           ])
        )

        it('should list user products correctly', () => {
            return logic.listUserWishes(user._id)
                .then(products => {
                    debugger
                    expect(products[0].title).to.equal('Thanos infinity gauntlet')
                    expect(products[0].closed).to.be.false
                    expect(products[0].initialPrice).to.equal(800)
                })
        })
    })

    !true && describe('list all products', () => {
        const product = new Product({
            title: 'Thanos infinity gauntlet',
            description: 'Original gauntlet used on the movie infinity war, whit all the infinit stones',
            initialDate: '2018-08-27T10:18:00',
            finalDate: '2018-08-30T10:18:00',
            initialPrice: 800,
            closed: false,
            image: 'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
            category: 'Marvel',
            bids: []
        })

        beforeEach(() =>
           Promise.resolve()
               .then(() => product.save())
        )
        
        it('should succeed on correct data', () => 
            logic.listProducts('thanos', 'Marvel')
                .then(products => {
                    expect(products[0].title).to.equal('Thanos infinity gauntlet')
                    expect(products[0].closed).to.be.false
                    expect(products[0].initialPrice).to.equal(800)
                })
        )

        it('should fail on space as a query', () =>
            logic.listProducts(' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid query'))
        )

        it('should fail on a query starting with a space', () =>
            logic.listProducts(' thanos')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid query'))
        )

        it('should fail on a query that does not exist', () =>
            logic.listProducts('almendruco')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('products not found'))
        )

        it('should fail on a category without products', () =>
            logic.listProducts(undefined, 'Music')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('products not found'))
    )
    })

    !true && describe('retrieve product', () => {
        const product = new Product({
            title: 'Thanos infinity gauntlet',
            description: 'Original gauntlet used on the movie infinity war, whit all the infinit stones',
            initialDate: '2018-08-27T10:18:00',
            finalDate: '2018-08-30T10:18:00',
            initialPrice: 800,
            closed: false,
            image: 'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
            category: 'Marvel',
            bids: []
        })

        beforeEach(() =>
           Promise.resolve()
               .then(() => product.save())
        )

        it('should succeed on correct data', () => 
            logic.retrieveProduct(product._id)
                .then(products => {
                    expect(products[0].title).to.equal('Thanos infinity gauntlet')
                    expect(products[0].closed).to.be.false
                    expect(products[0].initialPrice).to.equal(800)
                })
        )

        it('should fail on space as id', () => 
            logic.retrieveProduct(' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid product id'))
        )


    })

    !true && describe('retrieve user', () => {
        const user = new User({ email, password, role, name, surname })

        beforeEach(() =>
           Promise.resolve()
               .then(() => user.save())
        )

        it('should succeed on correct data', () => 
            logic.retrieveUser(user._id)
                .then(user => {
                    expect(user[0].email).to.equal(email)
                    expect(user[0].password).to.equal(password)
                    expect(user[0].name).to.equal(name)
                    expect(user[0].surname).to.equal(surname)
                    expect(user[0].role).to.equal(role)
                })
        )

        it('should fail on space as id user', () => 
            logic.retrieveUser(' ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid user id'))
        )


    })

    !true && describe('create product', () => {
        it('should create a new product', () => 
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .then(product =>{
                    expect(product.title).to.equal('Thanos infinity gauntlet')
                    expect(product.closed).to.be.false
                    expect(product.initialPrice).to.equal(800)
            })
        )

        it('should fail with a number as a title', () =>
            logic.addProduct(
                123,
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid title'))
        )

        it('should fail with a space as a title', () =>
            logic.addProduct(
                ' ',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid title'))
        )

        it('should fail with a title starting with a space', () =>
            logic.addProduct(
                ' thanos',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid title'))
        )

        it('should fail with a title ending with space', () =>
            logic.addProduct(
                'thanos ',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid title'))
        )

        it('should fail with a space as a description', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                ' ',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid description'))
        )

        it('should fail with an empty description', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                '',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid description'))
        )

        it('should fail with a description starting with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                ' description',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid description'))
        )

        it('should fail with a description ending with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'description ',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid description'))
        )

        it('should fail with a number as description', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                546,
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid description'))
        )

        it('should fail with an empty initial date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid initial date'))
        )

        it('should fail with a space as initial date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                ' ',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid initial date'))
        )

        it('should fail with an initial date starting with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                ' 2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid initial date'))
        )

        it('should fail with an initial date endnig with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00 ',
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid initial date'))
        )

        it('should fail with a number as initial date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                5,
                '2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid initial date'))
        )

        it('should fail with a number as final date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                30,
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid final date'))
        )

        it('should fail with a space as final date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                ' ',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid final date'))
        )

        it('should fail with an empty final date', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid final date'))
        )

        it('should fail with an final date starting with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                ' 2018-08-30T10:18:00',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid final date'))
        )

        it('should fail with an final date ending with space', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00 ',
                800,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid final date'))
        )

        it('should fail with a string as price', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                '800',
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('the value is not a number'))
        )

        it('should fail with an empty price', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                '',
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('the value is not a number'))
        )

        it('should fail with a space as a price', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                ' ',
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('the value is not a number'))
        )

        it('should fail with a string as the closed state of the product', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                'false',
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid closed'))
        )

        it('should fail with an empty image', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                '',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid image'))
        )

        it('should fail with a space as image', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                ' ',
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid image'))
        )

        it('should fail with a number as image', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                500,
                'Marvel',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid image'))
        )

        it('should fail with a number as category', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                6,
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid category'))
        )

        it('should fail with an empty category', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                '',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid category'))
        )

        it('should fail with a space as category', () =>
            logic.addProduct(
                'Thanos infinity gauntlet',
                'Original gauntlet used on the movie infinity war, whit all the infinit stones',
                '2018-08-27T10:18:00',
                '2018-08-30T10:18:00',
                500,
                false,
                'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
                ' ',
                []
            )
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal('invalid category'))
        )
    })

    !true && describe('add bid', () => {

        const user = new User({ email, password, role, name, surname })
        const bid = new Bid({price: 900, date: new Date(), user: user._id})
        const product = new Product({
            title: 'Thanos infinity gauntlet',
            description: 'Original gauntlet used on the movie infinity war, whit all the infinit stones',
            initialDate: '2018-08-27T10:18:00',
            finalDate: '2018-08-30T10:18:00',
            initialPrice: 800,
            closed: false,
            image: 'https://i.pinimg.com/originals/fb/c3/9a/fbc39a8147a728afd55f7fb21154d605.png',
            category: 'Marvel',
            bids: [bid]
        })

        beforeEach(() =>
           Promise.all([
               user.save(),
               bid.save(),
               product.save()
           ])
        )

        it('should add a bid', () =>{
            logic.addBid(product._id, user._id, 1000)
                .then(() => {debugger})
        })
    })

    after(() => 
        /*Promise.all([
            Product.deleteMany(),
            User.deleteMany()
        ])
        .then(() =>*/ _connection.disconnect()//)
    )

})