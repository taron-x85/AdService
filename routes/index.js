const express = require('express');
// const ad = require('../models/adModel');
const fs = require('fs');
const excel = require('node-excel-export');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Call from router');
    next();
});

router.get('/ad', (req, res) => {
    let _data = {};
    fs.readFile('./data.json', (err, data) => {
        if (!err) {
            _data = JSON.parse(data);
            //res.status(200).json(_data);
            // You can define styles as json object
            const styles = {
                firstHead: {
                    border: {
                        right: { style: 'medium', color: { rgb: '3B0472' } }
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center'
                    },
                    font: {
                        bold: true
                    }
                },
                secondHead: {
                    width: 100,
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center'
                    },
                    font: {
                        italic: true
                    }
                },
                cellGreen: {
                    fill: {
                        fgColor: {
                            rgb: 'FFEDE9'
                        }
                    },
                    width: 100,
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center'
                    },
                    font: {
                        italic: true
                    }
                }
            };

            let merges = [];
            let heading = [];
            let firstHeading = [];
            let secondHeading = [];
            let prevItemsCount = 1;
            let specification = {};
            let dataset = [];
            let rowValues = {};
            //
            for (const iterator of _data.transactionSettings.transactionTable) {
                const subItemCount = iterator.subItems.length;
                merges.push({ start: { row: 1, column: prevItemsCount }, end: { row: 1, column: (subItemCount + prevItemsCount - 1) } });
                prevItemsCount += subItemCount;
                firstHeading.push({
                    value: iterator.name,
                    style: {
                        alignment: {
                            horizontal: 'center',
                            vertical: 'center'
                        },
                        font: {
                            bold: true
                        }
                    },

                    border: {
                        right: {
                            style: 'medium', color: { rgb: '3B0472' }
                        }
                    }
                });
                for (let p = 0; p < subItemCount - 1; p++) {
                    firstHeading.push('');
                }
                for (const sub of iterator.subItems) {
                    secondHeading.push({ value: sub.name, style: styles.secondHead });
                    specification[sub.key] = {
                        displayName: sub.name,
                        headerStyle: styles.cellGreen,
                        cellStyle: function (value, row) {
                            console.log(row);
                            return {
                                fill: { fgColor: { rgb: 'F0EDE1 ' } }, alignment: {
                                    horizontal: 'center',
                                    vertical: 'center'
                                },
                                border: {
                                    right: {
                                        style: 'thin', color: { rgb: '031972' }
                                    }
                                }
                            };
                        },
                        width: 150
                    };
                }
            }
            heading.push(firstHeading);
            //heading.push(secondHeading);
            let _result = {};
            fs.readFile('./result.json', (err, data) => {
                if (!err) {
                    _result = JSON.parse(data);
                    console.log(_result.results);
                    for (const r of _result.results) {
                        for (const key in specification) {
                            if (Object.hasOwnProperty.call(specification, key)) {
                                let cellValue = null;
                                switch (key) {
                                    // General +
                                    case 'number':
                                        cellValue = r.number;
                                        break;
                                    case 'updatedAt':
                                        cellValue = r.updatedAt;
                                        break;
                                    case 'state':
                                        switch (r.state) {
                                            case 0: {
                                                cellValue = "Reject";
                                            }
                                            case 1: {
                                                cellValue = "Approve";
                                            }
                                            case 2: {
                                                cellValue = "Pending";
                                            }
                                            case 3: {
                                                cellValue = "Refunded";
                                            }
                                            case 4: {
                                                cellValue = "Refund Failed";
                                            }
                                        }
                                        break;
                                    case 'transaction_type':
                                        cellValue = r.transaction_type;
                                        break;
                                    case 'source_type':
                                        cellValue = r.source_type;
                                        break;
                                    case 'transactionId':
                                        cellValue = r.transactionId ? r.transactionId : '-';
                                        break;
                                    case 'stateMessage':
                                        cellValue = r.stateMessage ? r.stateMessage : '-';
                                        break;
                                    case 'amount':
                                        cellValue = r.amount;
                                        break;
                                    // General -
                                    // Bill +
                                    case 'invoicesNumber':
                                        cellValue = (r.invoices && r.invoices.length) ? r.invoices[0].number : '-';
                                        break;
                                    case 'invoicesStartDate':
                                        cellValue = (r.invoices && r.invoices.length) ? r.invoices[0].startDate : '-';
                                        break;
                                    // Bill -
                                    // My Incomes/Expenses +
                                    case 'myAmount':
                                        cellValue = r.amount;
                                        break;
                                    case 'transactionType':
                                        cellValue = r.transaction_type;
                                        break;
                                    case 'sourcePay':
                                        cellValue = r.invoices.length > 0 ? r.invoices[0]?.sourcePay : '-';
                                        break;
                                    // My Incomes/Expenses -
                                    // Initiator +
                                    case 'initiatorType':
                                        cellValue = r.from_provider ? 'Provider' : r.from_client ? 'Client' : '-';
                                        break;
                                    case 'initiatorName':
                                        cellValue = r.initiatorName ? r.initiatorName : '-';
                                        break;
                                    // Initiator -
                                    // Participant +
                                    case 'participantType':
                                        cellValue = r.to_provider ? 'Provider' : r.to_client ? 'Client' : '-'
                                        break;
                                    case 'participantName':
                                        cellValue = r.participantName ? r.participantName : '-'
                                        break;
                                    case 'locationLogin':
                                        if (r.invoices && r.invoices.length) {
                                            let logins = [];
                                            r.invoices[0].payloadCalculated.locations.map(item => {
                                                logins.push(item.locationLogin)
                                            })
                                            cellValue = logins.toString().split(',');
                                        } else {
                                            cellValue = '-';
                                        }
                                        break;
                                    case 'creditBefore':
                                        cellValue = r.invoices.length && r.invoices[0].provider[0].creditBefore ? r.provider[0].creditBefore : '-';
                                        break;
                                    case 'creditAfter':
                                        cellValue = r.invoices.length && r.invoices[0].provider[0].creditAfter ? r.invoices[0].provider[0].creditAfter : '-';
                                        break;
                                    case 'creditEndDate':
                                        cellValue = r.invoices && r.invoices.length && r.invoices[0].provider[0].creditEndDate !== undefined ? r.invoices[0].provider[0].creditEndDate : '-';
                                        break;
                                    case 'balanceBefore':
                                        cellValue = r.invoices.length && r.invoices[0].provider[0].balanceBefore ? r.invoices[0].provider[0].balanceBefore : '-';
                                        break;
                                    case 'balance':
                                        cellValue = r.invoices.length && r.invoices[0].provider[0].balance ? r.invoices[0].provider[0].balance : '-';
                                        break;
                                    case 'debt':
                                        cellValue = r.invoices.length ? r.invoices[0].provider[0]?.debt : '-';
                                        break;
                                    // Participant -
                                    // My Balance/Credit State +
                                    case 'myBalanceBefore':
                                        cellValue = r.provider.length && r.provider[0].myBalanceBefore ? r.provider[0].myBalanceBefore : '-';
                                        break;
                                    case 'providerBalance':
                                        cellValue = r.provider.length ? r?.provider[0]?.balance.toFixed(2) : '-';
                                        break;
                                    case 'providerDebt':
                                        cellValue = r.provider.length ? r?.provider[0]?.debt : '-';
                                        break;
                                    case 'myCreditBefore':
                                        cellValue = r.provider.length && r.provider[0].myCreditBefore ? r.provider[0].myCreditBefore : '-';
                                        break;
                                    case 'myCreditAfter':
                                        cellValue = r.provider.length && r.provider[0].myCreditAfter ? r.provider[0].myCreditAfter : '-';
                                        break;
                                    case 'myCreditEndDate':
                                        cellValue = r.provider.length && r.provider[0].myCreditEndDate ? r?.provider[0]?.myCreditEndDate : '-';
                                        break;
                                    // My Balance/Credit State -
                                    default:
                                        cellValue = '-';
                                        break;
                                }
                                rowValues[key] = cellValue;
                            }
                        }
                        dataset.push(rowValues);
                    }

                    const report = excel.buildExport(
                        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                            {
                                name: 'Report', // <- Specify sheet name (optional)
                                heading: heading, // <- Raw heading array (optional)
                                merges: merges, // <- Merge cell ranges
                                specification: specification, // <- Report specification
                                data: dataset // <-- Report data
                            }
                        ]
                    );

                    // You can then return this straight
                    res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                }
            });
        } else {
            res.status(500).send(err.message);
        }
    });

    //res.status(200).end();
    // const cdate = new Date();
    // const nad = new ad({
    //     name: 'test ad',
    //     endDate: cdate.setDate(cdate.getDate() + 1),
    //     price: 5000
    // });
    // await nad.save().then(() => {
    //     res.send('new ad saved!');
    // }).catch((ex) => {
    //     res.send(ex.message);
    // });
});

module.exports = router;