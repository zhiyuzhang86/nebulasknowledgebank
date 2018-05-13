'use strict';

var AuthorContent = function (text) {
    if (text) {
        var o = JSON.parse(text);
        this.totalLikes = new BigNumber(o.totalLikes);
        this.totalBalance = new BigNumber(o.totalBalance);
    } else {
        this.totalLikes = new BigNumber(0);
        this.totalBalance = new BigNumber(0);
    }
};

AuthorContent.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var KnowledgeContent = function (text) {
    if (text) {
        var o = JSON.parse(text);
        this.contentId = new BigNumber(o.contentId);
        this.content = o.content;
        this.authorAddress = o.authorAddress;
        this.numberOfLikes = new BigNumber(o.numberOfLikes);
        this.blockHeight = new BigNumber(o.blockHeight);
    } else {
        this.contentId = new BigNumber(0);
        this.content = '';
        this.authorAddress = '';
        this.numberOfLikes = new BigNumber(0);
        this.blockHeight = new BigNumber(0);
    }
};

KnowledgeContent.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var KnowledgeContract = function () {
    LocalContractStorage.defineMapProperty(this, "KnowledgeBook", {
        parse: function (text) {
            return new KnowledgeContent(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "AuthorPool", {
        parse: function (text) {
            return new AuthorContent(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

// save content to contract, only after height of block, users can takeout
KnowledgeContract.prototype = {
    init: function () {
        this.size = 0;
    },

    // create content
    create: function (content) {
        var from = Blockchain.transaction.from;
        var blockHeight = new BigNumber(Blockchain.block.height);

        var singleKnowledgeContent = new KnowledgeContent();
        singleKnowledgeContent.contentId = this.size;
        singleKnowledgeContent.content = content;
        singleKnowledgeContent.authorAddress = from;
        singleKnowledgeContent.numberOfLikes = 0;
        singleKnowledgeContent.blockHeight = blockHeight;

        if (!this.AuthorPool.get(from)) {
            var newAuthorContent = new AuthorContent();
            newAuthorContent.totalLikes = 0;
            newAuthorContent.totalBalance = 0;
            this.AuthorPool.put(from, newAuthorContent);
        }
        this.KnowledgeBook.put(this.size, singleKnowledgeContent);
        this.size += 1;
    },
    likeIdea: function (index) {
        var i = parseInt(index);
        var from = Blockchain.transaction.from;
        var tip = Blockchain.transaction.value;

        var singleKnowledgeContent = this.KnowledgeBook.get(i);
        var authorAddress = singleKnowledgeContent.authorAddress;
        var authorContent = this.AuthorPool.get(authorAddress);
        if (!authorContent) {
            throw new Error("No author!!!");
        } else {
            authorContent.totalBalance = authorContent.totalBalance.plus(tip);
            authorContent.totalLikes = authorContent.totalLikes.plus(1);
            singleKnowledgeContent.numberOfLikes = singleKnowledgeContent.numberOfLikes.plus(1);
            this.KnowledgeBook.put(i, singleKnowledgeContent);
            this.AuthorPool.put(authorAddress, authorContent);
        }

    },
    infoOf: function () {
        var from = Blockchain.transaction.from;
        return this.AuthorPool.get(from);
    },
    getAccountInfo: function (address) {
        return this.AuthorPool.get(address);
    },
    allKnowledgesTimeAsc: function () {
        var result = [];
        for (var index = 0; index < this.size; index++) {
            result.push(this.KnowledgeBook.get(index));
        }
        return JSON.stringify(result);
    },
    allKnowledgesTimeDesc: function () {
        var result = [];
        for (var index = this.size - 1; index >= 0; index--) {
            result.push(this.KnowledgeBook.get(index));
        }
        return JSON.stringify(result);
    },

    verifyAddress: function (address) {
        // 1-valid, 0-invalid
        var result = Blockchain.verifyAddress(address);
        return {
            valid: result == 0 ? false : true
        };
    }
};
module.exports = KnowledgeContract;