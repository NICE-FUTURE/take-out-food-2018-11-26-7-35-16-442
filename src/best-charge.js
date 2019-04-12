// var loadAllPromotions = require('./promotions.js');  // 加载优惠信息
// var loadAllItems = require('./items.js');  // 加载菜品项

function bestCharge(selectedItems) {

    var items = loadAllItems();
    var scale = loadPromotions()[1].items;

    var order = generateOrder(selectedItems, items);  // 转换成订单
    var promotion = calculatePromotion(order, scale);  // 计算优惠
    var summary = generateSummary(order, promotion);  // 生成描述

    return summary;
}

function generateOrder(selectedItems, items) {
    // 生成订单信息
    order = [];
    for (let ele of selectedItems) {
        pieces = ele.split(' x ');
        for (let item of items) {
            if (item.id === pieces[0]) {
                order.push({'id': pieces[0], 'count': +pieces[1], 'name': item.name, 'price': item.price});
            }
        }
    }
    return order;
}

function calculatePromotion(order, scale) {
    //指定菜品半价，scale 中的 id 进行半价优惠
    var prom = 0;
    var names = [];
    order.forEach(function(item) {
        if (scale.indexOf(item.id) != -1) {
            prom += item.price/2;
            names.push(item.name);
        }
    })
    var prom1 = {
        'note': '指定菜品半价('+names.join('，')+')',
        'prom': prom
    };

    //满减优惠
    var total = 0;
    order.forEach(function(item) {
        total += item.price*item.count;
    })
    var prom2 = {
        'note': '满30减6元',
        'prom': Math.floor(total/30)*6
    };

    //比较两种优惠
    if (prom1.prom > prom2.prom) {
        return prom1;
    } else {
        return prom2;
    }
}

function generateSummary(order, prom) {
    // 生成描述
    var total = 0;
    var summary = '============= 订餐明细 =============\n';
    for (let item of order) {
        summary += (item.name+' x '+item.count+' = '+item.price*item.count+'元\n');
        total += item.price*item.count;
    }
    summary += '-----------------------------------\n';
    if (prom.prom > 0) {
        summary += '使用优惠:\n' + prom.note + '，省' + prom.prom + '元\n';
        summary += '-----------------------------------\n';
    }
    summary += '总计：' + (total-prom.prom) + '元\n';
    summary += '===================================\n';

    return summary;
}

//let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
// let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
// let inputs = ["ITEM0013 x 4"];
//let result = bestCharge(inputs).trim();
//console.log(result);
// for (i of result) {
//     console.log(i);
// }

module.exports = bestCharge;
