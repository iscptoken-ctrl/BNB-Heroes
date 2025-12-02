from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB = "bnb_heroes.db"

# Wallet set
@app.route("/wallet", methods=["POST"])
def set_wallet():
    data = request.json
    user_id = data["user_id"]
    wallet = data["wallet"]
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO users(user_id, wallet) VALUES(?, ?)", (user_id, wallet))
    conn.commit()
    conn.close()
    return jsonify({"status":"ok"})

# Deposit
@app.route("/deposit", methods=["POST"])
def deposit():
    data = request.json
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("INSERT INTO deposit_requests(user_id, tx_hash, amount) VALUES(?,?,?)", 
              (data["user_id"], data["tx_hash"], data["amount"]))
    conn.commit()
    conn.close()
    return jsonify({"status":"ok"})

# Withdraw
@app.route("/withdraw", methods=["POST"])
def withdraw():
    data = request.json
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("INSERT INTO withdraw_requests(user_id, token, amount) VALUES(?,?,?)",
              (data["user_id"], data["token"], data["amount"]))
    conn.commit()
    conn.close()
    return jsonify({"status":"ok"})

# Leaderboard
@app.route("/leaderboard")
def leaderboard():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT username, balanceBCR+balanceCD1+balanceMVS FROM users ORDER BY balanceBCR+balanceCD1+balanceMVS DESC LIMIT 50")
    data = c.fetchall()
    conn.close()
    return jsonify(data)

if __name__=="__main__":
    app.run(port=5000)
