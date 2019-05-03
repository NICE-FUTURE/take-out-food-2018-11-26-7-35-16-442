// var loadPromotions = require('./promotions.js');  // 加载优惠信息
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
    selectedItems.forEach((ele) => {
        pieces = ele.split(' x ');
        items.forEach((item) => {
            if (item.id === pieces[0])
                order.push({'id': pieces[0], 'count': +pieces[1], 'name': item.name, 'price': item.price});
        });
    });
    return order;
}

function calculatePromotion(order, scale) {
    //指定菜品半价，scale 中的 id 进行半价优惠
    var prom = 0;
    var names = [];
    order.forEach((item) => {
        if (scale.includes(item.id)) {
            prom += item.price/2;
            names.push(item.name);
        }
    });
    var prom1 = {
        'note': '指定菜品半价('+names.join('，')+')',
        'prom': prom
    };

    //满减优惠
    var total = 0;
    order.forEach((item) => {
        total += item.price*item.count;
    })
    var prom2 = {
        'note': '满30减6元',
        'prom': Math.floor(total/30)*6
    };

    //比较两种优惠
    return prom1.prom > prom2.prom ? prom1 : prom2; 
}

function generateSummary(order, prom) {
    // 生成描述
    var total = 0;
    var summary = '============= 订餐明细 =============\n';
    order.forEach((item) => {
        summary += (item.name+' x '+item.count+' = '+item.price*item.count+'元\n');
        total += item.price*item.count;
    });
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
