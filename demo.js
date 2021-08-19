/********** 啟動 bootstrap popovers **********/
const enableBootstrapPopovers = () => {
    var popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
};

/********** 啟動 bootstrap tooltips **********/
const enableBootstrapTooltips = () => {
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

/********** 移除驗證錯誤提醒 **********/
const removeValidFailedClass = () => {
    $('#updateCnname').removeClass('highlighted');
    $('#updateEnname').removeClass('highlighted');
    $('#updateMobile').removeClass('highlighted');
    $('#updateEmail').removeClass('highlighted');
    $('#updateCnnameTip').text('');
    $('#updateEnnameTip').text('');
    $('#updateMobileTip').text('');
    $('#updateEmailTip').text('');
};

/********** 驗證欄位 **********/
const isVerified = () => {
    let result = true;

    // 取得 modal 上的中文姓名、英文姓名、手機號碼、電子信箱
    let updateCnnameVal = $('#updateCnname').val();
    let updateEnnameVal = $('#updateEnname').val();
    let updateMobileVal = $('#updateMobile').val();
    let updateEmailVal = $('#updateEmail').val();

    // 中文、英文、手機號碼、電子信箱 正則表達式
    let cnRegex = /^[\u4e00-\u9fa5]+$/;
    let enRegex = /^[a-zA-Z]+$/;
    let mobileRegex = /^[0]{1}[9]{1}[0-9]{4}[0-9]{4}$/;
    let emailRegex =
        /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    // 判斷格式是否正確
    if (!cnRegex.test(updateCnnameVal)) {
        $('#updateCnname').addClass('highlighted');
        $('#updateCnnameTip').text('格式錯誤');
        result = false;
    }
    if (!enRegex.test(updateEnnameVal)) {
        $('#updateEnname').addClass('highlighted');
        $('#updateEnnameTip').text('格式錯誤');
        result = false;
    }
    if (!mobileRegex.test(updateMobileVal)) {
        $('#updateMobile').addClass('highlighted');
        $('#updateMobileTip').text('格式錯誤');
        result = false;
    }
    if (!emailRegex.test(updateEmailVal)) {
        $('#updateEmail').addClass('highlighted');
        $('#updateEmailTip').text('格式錯誤');
        result = false;
    }

    return result;
};

/********** 手機號碼格式轉換 **********/
const mobileNoFormat = (mobile) => {
    return mobile.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
};

$(document).ready(function () {
    // alert('abc');
    var url = 'ajax/ajaxCard';
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();

    // 搜尋按鈕
    $('#searchbutton').click(function () {
        $('#dialog-searchconfirm').dialog({
            resizable: true,
            height: $(window).height() * 0.4, // dialog視窗度
            width: $(window).width() * 0.4,
            modal: true,
            buttons: {
                // 自訂button名稱
                搜尋: function (e) {
                    var url = 'ajax/ajaxCard';
                    // var data = $("#searchform").serialize();
                    var cnname = $('#secnname').val();
                    var enname = $('#seenname').val();
                    var sex = $('input:radio:checked[name="sesex"]').val();
                    var ajaxobj = new AjaxObject(url, 'json');
                    ajaxobj.cnname = cnname;
                    ajaxobj.enname = enname;
                    ajaxobj.sex = sex;
                    ajaxobj.search();

                    e.preventDefault(); // avoid to execute the actual submit of the form.
                },
                重新填寫: function () {
                    $('#searchform')[0].reset();
                },
                取消: function () {
                    $(this).dialog('close');
                },
            },
        });
    });

    /********** 新增 **********/
    // 新增鈕
    $('#addButton').on('click', () => {
        $('#addModal .gender-container input:radio[value="男"]').prop(
            'checked',
            true
        );
    });
    // modal 新增確認鈕
    $('#addModalConfirm').on('click', () => {
        var row = $('<tr></tr>');
        row.append($('<td></td>').html($('#addCnname').val()));
        row.append($('<td></td>').html($('#addEnname').val()));
        row.append(
            $('<td></td>').html(
                $('#addModal .gender-container input:radio:checked').val()
            )
        );
        row.append(
            $('<td></td>').html(
                '<i class="update-button fas fa-pen" data-bs-toggle="modal" data-bs-target="#updateModal"></i>'
            )
        );
        row.append(
            $('<td></td>').html(
                '<i class="delete-button far fa-trash-alt" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>'
            )
        );
        $('#cardtable').append(row);
    });

    /********** 修改 **********/
    // 修改鈕
    $('#cardtable').on('click', '.update-button', function () {
        updateThis = $(this);

        // 移除驗證錯誤提醒
        removeValidFailedClass();

        // 取得表格上的內容
        let cnname = $(this).parent().siblings('td:nth-child(1)').text();
        let enname = $(this).parent().siblings('td:nth-child(2)').text();
        let gender = $(this).parent().siblings('td:nth-child(3)').text();
        let mobile = $(this).parent().siblings('td:nth-child(4)').text();
        let email = $(this).parent().siblings('td:nth-child(5)').text();

        // 設定中文、英文姓名、手機號碼、電子信箱至 modal
        $('#updateCnname').val(cnname);
        $('#updateEnname').val(enname);
        $('#updateMobile').val(mobile);
        $('#updateEmail').val(email);

        // 設定性別至 modal
        gender === '男'
            ? $(
                  '#updateModal .gender-container input:radio[value="男"]'
              ).prop('checked', true)
            : $(
                  '#updateModal .gender-container input:radio[value="女"]'
              ).prop('checked', true);
    });
    // modal 修改確認鈕
    $('#updateModalConfirm').on('click', () => {
        // 取得 modal 上的中文姓名、英文姓名、手機號碼、電子信箱、性別 value
        let updateCnnameVal = $('#updateCnname').val();
        let updateEnnameVal = $('#updateEnname').val();
        let updateMobileVal = $('#updateMobile').val();
        let updateEmailVal = $('#updateEmail').val();
        let updateGenderVal = $(
            '#updateModal .gender-container input:radio:checked'
        ).val();

        // 移除驗證錯誤提醒
        removeValidFailedClass();

        // 驗證欄位格式
        if (isVerified() === true) {
            // 取得表格上的中文姓名、英文姓名、手機號碼、電子信箱、性別欄位
            let cnname = updateThis.parent().siblings('td:nth-child(1)');
            let enname = updateThis.parent().siblings('td:nth-child(2)');
            let gender = updateThis.parent().siblings('td:nth-child(3)');
            let mobile = updateThis.parent().siblings('td:nth-child(4)');
            let email = updateThis.parent().siblings('td:nth-child(5)');
            // 設定至表格上
            cnname.text(updateCnnameVal);
            enname.text(updateEnnameVal);
            gender.text(updateGenderVal);
            mobile.text(updateMobileVal);
            email.text(updateEmailVal);

            delete updateThis;
            $('#updateModal').modal('hide');
        }
    });

    /********** 刪除 **********/
    // 刪除鈕
    $('#cardtable').on('click', '.delete-button', function () {
        deleteThis = $(this);
        let deleteName = $(this)
            .parent()
            .siblings('td:nth-child(1)')
            .text();
        $('#deleteModalBody').text(`確定要刪除 ${deleteName} 嗎?`);
    });
    // modal 確認刪除鈕
    $('#deleteModalConfirm').on('click', () => {
        deleteThis.parents('tr').remove();
        delete deleteThis;
        $('#deleteModal').modal('hide');
    });

    /********** 欄位變色 **********/
    $('#cardtable td').hover(
        function () {
            let i = $(this).index() + 1;
            $(`#cardtable td:nth-child(${i})`).addClass('highlighted');
            $(this).removeClass('highlighted');
        },
        function () {
            let i = $(this).index() + 1;
            $(`#cardtable td:nth-child(${i})`).removeClass('highlighted');
        }
    );

    // 自適應視窗
    // $(window).resize(function () {
    //     var wWidth = $(window).width();
    //     var dWidth = wWidth * 0.4;
    //     var wHeight = $(window).height();
    //     var dHeight = wHeight * 0.4;
    //     $('#dialog-confirm').dialog('option', 'width', dWidth);
    //     $('#dialog-confirm').dialog('option', 'height', dHeight);
    // });
});
function refreshTable(data) {
    // var HTML = '';
    $('#cardtable tbody > tr').remove();
    $.each(data, function (key, item) {
        // 啟動 bootstrap popovers
        enableBootstrapPopovers();

        var strsex = '';
        if (item.sex == 0) strsex = '男';
        else strsex = '女';
        var row = $('<tr></tr>');
        row.append(
            $(
                `<td data-bs-toggle="tooltip" data-bs-placement="bottom" title="[${strsex}]${item.cnname}(${item.enname})"></td>`
            ).html(item.cnname)
        );
        row.append($('<td></td>').html(item.enname));
        row.append($('<td></td>').html(strsex));
        row.append(
            $(
                `<td data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="聯絡方式：${mobileNoFormat(
                    item.mobile
                )}"></td>`
            ).html(item.mobile)
        );
        row.append($('<td></td>').html(item.email));
        row.append(
            $('<td></td>').html(
                '<i class="update-button fas fa-pen" data-bs-toggle="modal" data-bs-target="#updateModal"></i>'
            )
        );
        row.append(
            $('<td></td>').html(
                '<i class="delete-button far fa-trash-alt" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>'
            )
        );
        $('#cardtable').append(row);

        // 啟動 bootstrap tooltips
        enableBootstrapTooltips();

        // 啟動 bootstrap popovers
        enableBootstrapPopovers();
    });
}

/**
 *
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname = '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert('Alert:');
};
AjaxObject.prototype.getall = function () {
    response =
        '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0","mobile":"0911123456","email":"aaa@gmail.com"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0","mobile":"0922123456","email":"bbb@gmail.com"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","mobile":"0933123456","email":"ccc@gmail.com"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","mobile":"0944123456","email":"ddd@gmail.com"}]';
    refreshTable(JSON.parse(response));
};
AjaxObject.prototype.modify_get = function () {
    response =
        '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
    initEdit(JSON.parse(response));
};
AjaxObject.prototype.search = function () {
    response =
        '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
    refreshTable(JSON.parse(response));
    $('#dialog-searchconfirm').dialog('close');
};