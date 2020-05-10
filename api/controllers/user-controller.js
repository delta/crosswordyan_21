const User = require('../models/User');
const signale = require('signale');
const Imap = require('imap');
const config = require('../../config/config');


exports.renderLoginform = (req,res) => {
    res.render("login");
}

var authenticate = async (username, password) => {
    var imap = new Imap({
        user: username,
        password: password,
        host: config.imap.host,
        port: config.imap.port,
        tls: false,
        authTimeout: 30000
    });

    return new Promise((resolve, reject) => {
        imap.once("ready", () => {
          imap.end();
          resolve(true);
        });
    
        imap.once("error", error => {
          console.error(error);
          reject(error);
        });
    
        imap.connect();
    });
}

exports.loginUser = async (req,res) => {
     // user registration function
     let username=req.body.webmail;
     let password= req.body.password;

    let imapResponse;
    try {
        imapResponse = await authenticate(username, password);
    } catch (err) {
        signale.error(err);
        return res.redirect('/login');
    }

    if(imapResponse){
        signale.info(imapResponse);
        signale.info(`${username} logged in`);
        req.session.user = {
            name: username
        }
        return res.redirect('/user/game');
    }
}

exports.renderGame = (req,res) => {
    res.render("Game");
}

exports.renderAfterGame = (req,res) => {
    res.render('AfterGame');
}

exports.saveGame = (req,res) => {
    signale.success("Game saved");
}

exports.renderLeaderboard = (req,res) => {
    res.render('Leaderboard');
}