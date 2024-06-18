// Copyright (c) 2024, Gursewak Singh and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Program1", {
// 	refresh(frm) {

// 	},
// });



frappe.ui.form.on('Program1', {
    refresh: function (frm) {
        // Add "Add New Item" button
        frm.add_custom_button(('Add New Item'), function () {
            // Dialog for adding new item
            let d = new frappe.ui.Dialog({
                title: 'Add New Item',
                fields: [
                    {
                        label: 'Item Group',
                        fieldname: 'item_group',
                        fieldtype: 'Link',
                        options: 'Item Group',
                        reqd: 1
                    },
                    {
                        label: 'Item',
                        fieldname: 'item',
                        fieldtype: 'Link',
                        options: 'Item',
                        reqd: 1,
                        get_query: function () {
                            return {
                                filters: {
                                    item_group: d.get_value('item_group')
                                }
                            };
                        }
                    },
                    {
                        label: 'Item Name',
                        fieldname: 'item_name',
                        fieldtype: 'Data',
                        read_only: 1
                    },
                    {
                        label: 'Quantity',
                        fieldname: 'quantity',
                        fieldtype: 'Int',
                        reqd: 1
                    },
                    {
                        label: 'Finish',
                        fieldname: 'finish',
                        fieldtype: 'Check'
                    },
                    {
                        label: 'Description',
                        fieldname: 'description',
                        fieldtype: 'Text',
                        reqd: 1
                    }
                ],
                primary_action_label: 'Add',
                primary_action: function (data) {
                    frm.add_child('program_items', {
                        item_group: data.item_group,
                        item: data.item,
                        item_name: data.item_name,
                        quantity: data.quantity,
                        finish: data.finish,
                        description: data.description
                    });
                    frm.refresh_field('program_items');
                    frm.dirty();
                    frm.save().then(() => {
                        frappe.msgprint(('Item added successfully'));
                    }).catch((err) => {
                        frappe.msgprint(('Failed to add item: ' + err));
                    });
                    d.hide();
                }
            });

            d.fields_dict.item.df.onchange = () => {
                let item = d.get_value('item');
                if (item) {
                    frappe.db.get_value('Item', item, 'item_name', (r) => {
                        d.set_value('item_name', r.item_name);
                    });
                }
            };
            d.show();
        });

        // Add "Update Item" button
        frm.add_custom_button(('Update Item'), function () {
            let items = frm.doc.program_items.filter(item => !item.finish);
            if (items.length === 0) {
                frappe.msgprint(('No items available to update'));
                return;
            }
            let options = items.map(item => ({
                label: `${ item.item_name }(${ item.item })`,
                value: item.name
            }));

let d = new frappe.ui.Dialog({
    title: 'Update Item',
    fields: [
        {
            label: 'Select Item',
            fieldname: 'selected_item',
            fieldtype: 'Select',
            options: options,
            reqd: 1
        },
        {
            label: 'Quantity',
            fieldname: 'quantity',
            fieldtype: 'Int',
            reqd: 1
        },
        {
            label: 'Finish',
            fieldname: 'finish',
            fieldtype: 'Check'
        },
        {
            label: 'Description',
            fieldname: 'description',
            fieldtype: 'Text',
            reqd: 1
        }
    ],
    primary_action_label: 'Update',
    primary_action: function (data) {
        let item = frm.doc.program_items.find(item => item.name === data.selected_item);
        if (item) {
            item.quantity = data.quantity;
            item.finish = data.finish;
            item.description = data.description;
            frm.refresh_field('program_items');
            frm.dirty();
            frm.save().then(() => {
                frappe.msgprint(('Item updated successfully'));
            }).catch((err) => {
                frappe.msgprint(('Failed to update item: ' + err));
            });
            d.hide();
        } else {
            frappe.msgprint(('Selected item not found'));
        }
    }
});

d.fields_dict.selected_item.df.onchange = () => {
    let selected_item_name = d.get_value('selected_item');
    let item = frm.doc.program_items.find(item => item.name === selected_item_name);
    if (item) {
        d.set_value('quantity', item.quantity);
        d.set_value('finish', item.finish);
        d.set_value('description', item.description);
    }
};
d.show();
        });
    }
});