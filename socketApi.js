const {DbUrl, DbName} = require('./configs/constant');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken");
var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};
var dangTruyCap = 0;
socketApi.io = io;

io.on('connection', async (socket)=>{
    dangTruyCap = dangTruyCap +1;
    console.log('a user connected:'+socket.id);
    try {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect();
        const db = client.db(DbName);
        const colCauHinh = db.collection('CauHinh');

        let resCauHinh = await colCauHinh.find({type: 0}).next();
        let updateLuotTruyCap = await colCauHinh.updateOne({type: 0},{
            $inc: {
                tongLuotTruyCap:1
            }
        });
        client.close();
        io.sockets.emit('dangTruyCap',{dangTruyCap:dangTruyCap,tongLuotTruyCap:resCauHinh.tongLuotTruyCap+1});
       // io.sockets.emit('tongLuotTruyCap',resCauHinh.tongLuotTruyCap+1);
    } catch (e) {
        console.log(e)
    }

    socket.on('guiTinNhan', async({idChat,tokenNguoiGui,noiDung}) => {
        const client = new MongoClient(DbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
      /*  console.log(idChat)
        console.log(tokenNguoiGui)
        console.log(noiDung)*/
        try {
            const resultToken = await jwt.verify(tokenNguoiGui, process.env.SECRET_KEY);
            const userId = resultToken.payload.userId;
            await client.connect();
            const db = client.db(DbName);
            const colChat = db.collection('Chat');
            const colTinNhan = db.collection('TinNhan');
           // console.log('message:'+data);
            let updateChat = await colChat.updateOne({_id:ObjectId(idChat)},{
                $inc:{
                    daDoc:1
                },
                $set:{
                    updateAt:new Date()
                }
            });
            const thoiGian = new Date();
            let luuTinNhan = await colTinNhan.insertOne({
                noiDung:noiDung,
                thoiGian: thoiGian,
                ID_NguoiGui:ObjectId(userId),
                ID_Chat: ObjectId(idChat)
            });
            client.close();
            socket.broadcast.emit('thongBaoTinNhan',{idChat:idChat,tinNhan:{
                    position: 'left',
                    type: 'text',
                    text: noiDung,
                    date:  thoiGian,
                }});
        } catch (e) {
            console.log(e)
        }
    });

    socket.on('disconnect', () => {
        dangTruyCap = dangTruyCap -1;
        console.log('user disconnected:'+socket.id);
        io.sockets.emit('dangTruyCap',{dangTruyCap:dangTruyCap});
    });
});




socketApi.CapNhatSoLuongHang = ()=> {
    io.sockets.emit('reloadSoLuongHang','reload');
};







module.exports = socketApi;