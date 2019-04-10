function halfPrice(order, tar) {
    //指定菜品半价
    var prom = 0;
    var names = [];
    order.forEach(function(item) {
        if (tar.indexOf(item.id) != -1) {
            prom += item.price/2;
            names.push(item.name);
        }
    })
    return {'note': '指定菜品半价('+names.join('，')+')', 'prom': prom};
}

function specialPromotion(order) {
    //满减优惠
    var total = 0;
    order.forEach(function(item) {
        total += item.price*item.count;
    })
    return {'note': '满30减6元', 'prom': Math.floor(total/30)*6};
}

function id2item(items, id) {
    // 将 id 对应到 item 返回
    for (let item of items) {
        if (item.id === id) return item; 
    }
    return null;
}

function generateOrder(selectedItems, items) {
    // 生成订单信息
    order = [];
    selectedItems.forEach(function(ele){
        pieces = ele.split(' x ');
        item = id2item(items, pieces[0]);
        order.push({'id': pieces[0], 'count': +pieces[1], 'name': item.name, 'price': item.price});
    })
    return order;
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

function bestCharge(selectedItems) {
    var promotions = require('./promotions.js')();  // 加载优惠信息
    var items = require('./items.js')();  // 加载菜品项
    var order = generateOrder(selectedItems, items);  // 转换成订单
    
    var prom1 = halfPrice(order, promotions[1].items);  // 检查指定菜品半价优惠
    var prom2 = specialPromotion(order);  // 检查满减优惠

    // 比较优惠力度，判断并输出
    var prom;
    if (prom1.prom > prom2.prom) {
        prom = prom1;
    } else {
        prom = prom2;
    }

    // 生成描述
    var summary = generateSummary(order, prom);

    return summary;
}

module.exports = bestCharge;

// let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
// let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
// let inputs = ["ITEM0013 x 4"];
// let result = bestCharge(inputs).trim();
// console.log(result);
// for (i of result) {
//     console.log(i);
// }
