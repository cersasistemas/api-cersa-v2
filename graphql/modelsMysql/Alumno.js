const db = require("../../scripts/mysql")
const {passwordHash} = require("../../scripts/utils")

module.exports = {
    create: async ({nombres, a_paterno, a_materno, dni, celular, departamento, email, password}) => {
        password = await passwordHash(password ? password : dni)

        const values = {
            auth: 'manual',
            confirmed: '1',
            policyagreed: '0',
            deleted: '0',
            suspended: '0',
            mnethostid: '1',
            username: email.toLowerCase(),
            password: password.replace(/^\$2b/, '$2y'),
            idnumber: '',
            firstname: nombres,
            lastname: `${a_paterno ? a_paterno : ''} ${a_materno ? a_materno : ''}`,
            email: email.toLowerCase(),
            emailstop: '0',
            icq: '',
            skype: '',
            yahoo: '',
            aim: '',
            msn: '',
            phone1: celular ? celular : '',
            phone2: '',
            institution: '',
            department: '',
            address: '',
            city: departamento ? departamento : '',
            country: 'PE',
            lang: 'en',
            calendartype: 'gregorian',
            theme: '',
            timezone: '99',
            firstaccess: '0',
            lastaccess: '0',
            lastlogin: '0',
            currentlogin: '0',
            lastip: '',
            secret: '',
            picture: '0',
            url: '',
            description: null,
            descriptionformat: '1',
            mailformat: '1',
            maildigest: '0',
            maildisplay: '2',
            autosubscribe: '1',
            trackforums: '0',
            timecreated: '0',
            timemodified: '0',
            trustbitmask: '0',
            imagealt: null,
            lastnamephonetic: null,
            firstnamephonetic: null,
            middlename: null,
            alternatename: null
        }

        return db.many('INSERT INTO mdl_user SET ?', values)
    },
    getByEmail: async email => {

        return await db.one(`SELECT * FROM mdl_user WHERE username=? or email=?`, [email.toLowerCase(), email.toLowerCase()])
    },
    update: async ({email, password, id}) => {
        return await db.many('UPDATE mdl_user SET username=?, password=? WHERE id=?', [email, password.replace(/^\$2b/, '$2y'), id])
            .then(req => req)
            .catch(err => err)
    }
}