const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

if (process.env.NODE_ENV !== "production") {
    db.settings({
        host: "localhost:8080",
        ssl: false,
    });
}

exports.addNewUser = functions.auth.user().onCreate((user) => {
    return db.collection("users").doc(user.uid).set({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        currentRoom: null,
        r,
    });
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
    const doc = db.collection("users").doc(user.uid);
    return doc?.delete();
});

exports.createRoom = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const blind = data.blind;
    const minEnterance = data.min;
    const roomId = randomCode();

    await db.collection("rooms").doc(roomId).set({
        roomId: roomId,
        blind: blind,
        blindTemp: blind,
        minEnterance: minEnterance,
        host: userId,
        players: [],
        turn: 0,
        roundBets: [],
        totalBet: 0,
        round: 0,
        playerCount: 0,
        firstRound: true,
        origin: 0,
    });

    return { message: "Succesfully created room", roomId: roomId };
});

exports.checkRoom = functions.https.onCall(async (data, context) => {
    console.log("Check Room Run");
    roomId = data.roomId;

    const roomRef = db.collection("rooms").doc(roomId);
    const doc = await roomRef.get();

    if (doc.exists) {
        data = doc.data();
        return { room: roomId, minEnterance: data.minEnterance };
    } else {
        return { room: null };
    }
});

exports.addUserToRoom = functions.https.onCall(async (data, context) => {
    const enterance = data.enterance;
    const roomId = data.roomId;
    const userId = context.auth.uid;

    const roomRef = db.collection("rooms").doc(roomId);
    const userRef = db.collection("users").doc(userId);

    const doc = await roomRef.get();

    const rdata = doc.data();

    let players = rdata.players;
    let playerCount = rdata.playerCount;

    players.push({ userId: userId, bank: enterance });

    await roomRef.update({ players: players, playerCount: playerCount + 1 });
    await userRef.update({ currentRoom: roomId });

    return { message: "Succesfully added the user" };
});

exports.leaveRoom = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const roomId = data.roomId;

    const roomRef = db.collection("rooms").doc(roomId);
    const userRef = db.collection("users").doc(userId);

    const doc = await roomRef.get();

    const rdata = doc.data();
    let players = rdata.players;
    let gameTurn = rdata.turn;
    let playerCount = rdata.playerCount;
    let origin = rdata.origin;
    let userIndex;
    //TODO get index from frontend
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.userId === userId) {
            userIndex = i;
            break;
        }
    }
    if (userIndex < gameTurn) {
        gameTurn--;
        origin--;
    }
    const filteredPlayers = players.filter((player) => player.userId !== userId);

    await roomRef.update({
        players: filteredPlayers,
        turn: gameTurn,
        playerCount: playerCount - 1,
        origin: origin,
    });

    await userRef.update({
        currentRoom: null,
    });

    return { message: "Succesfully left room" };
});

exports.deleteRoom = functions.https.onCall(async (data, context) => {
    const roomId = data.roomId;
    const roomRef = db.collection("rooms").doc(roomId);

    const roomDoc = await roomRef.get();
    const players = roomDoc.data().players;

    async function leavePlayer(player) {
        const userRef = db.collection("users").doc(player.userId);
        userRef.update({ currentRoom: null });
    }

    for (let i = 0; i < players.length; i++) {
        await leavePlayer(players[i]);
    }

    await roomRef.delete();

    return { message: "Room Deleted" };
});

exports.bet = functions.https.onCall(async (data, context) => {
    const roomId = data.roomId;
    const bet = data.bet;
    const index = data.index;

    const roomRef = db.collection("rooms").doc(roomId);

    const room = await roomRef.get();

    const rData = room.data();
    let turn = rData.turn;
    let bets = rData.roundBets;
    const playerCount = rData.playerCount;
    let blindTemp = rData.blindTemp;
    let totalBet = rData.totalBet + bet;
    let firstRound = rData.firstRound;
    let origin = rData.origin;
    let round = rData.round;

    let players = rData.players;
    let player = players[index];
    let playerBank = player.bank - bet;

    player.bank = playerBank;
    players[index] = player;

    if (!firstRound) {
        let previous= index===0? playerCount-1: index-1;
        if (bet > bets[previous].bet) {
            origin = index;
        }
    }

    if (firstRound) {
        firstRound = false;
    }

    if ((index + 1) % playerCount === origin) {
        bets = [];
        blindTemp = 0;
        turn = -1;
        origin = 0;
        round += 1;
        firstRound= true;
    } else {
        bets.push({
            from: context.auth.uid,
            bet: bet,
        });
    }

    await roomRef.update({
        roundBets: bets,
        turn: (turn + 1) % playerCount,
        firstRound: firstRound,
        totalBet: totalBet,
        players: players,
        origin: origin,
        blindTemp: blindTemp,
        round: round,
    });

    return { message: "succesfull" };
});
const randomCode = () => {
    const prefix = "R";
    const length = 6;
    let code = prefix + "-";

    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }
    return code;
};
