"use strict";
var landing = (() => {
    class r {
        static get contactIdKey() { return "ContactId" } static get bulkEmailRecipientIdKey() { return "BulkEmailRecipientId" } static get cookieExpireDays() { return 7 } get contactId() { var e; return this._contactId || (e = r.contactIdKey, this._contactId = { name: e, value: r.getURLParameter(e) || r.getCookie(e) }), this._contactId } get bulkEmailRecipientId() { var e; return this._bulkEmailRecipientId || (e = r.bulkEmailRecipientIdKey, this._bulkEmailRecipientId = { name: e, value: r.getURLParameter(e) || r.getCookie(e) }), this._bulkEmailRecipientId } static get cookie() { return document.cookie } static get jQuery() { if (window.jQuery) return window.jQuery; throw Error("jQuery not found") } get config() { if (this._config) return this._config; throw Error("Config not found") } set config(e) { this._config = e } static $() { if (window.jQuery) return window.jQuery.apply(window.jQuery, arguments); throw Error("jQuery not found") } static addFieldRecord(e, t, i) { e.formFieldsData.push({ name: t, value: i }) } static parseResponse(e) { return e = (e = e.replace("resultCode", '"resultCode"')).replace("resultMessage", '"resultMessage"'), JSON.parse(e) } static getCookie(e) { return e && (e = new RegExp("(?:(?:^|.*;)\\s*" + e + "\\s*\\=\\s*([^;]*).*$)|^.*$"), r.cookie.replace(e, "$1")) || "" } static getCorrectCookiesName(e) { return { BpmRef: "bpmRef", BpmHref: "bpmHref" } [e] } static setCookiesData(e) {
            for (var t of ["BpmRef", "BpmHref"]) {
                var i = r.getCorrectCookiesName(t),
                    i = r.getCookie(i);
                i && r.addFieldRecord(e, t, i)
            }
        }
        static getElementValueBySelector(e) { e = r.$(e)[0]; return e ? r.$(e).is(":checkbox") ? r.$(e).prop("checked") : r.$(e).val() : "" } static setElementValueBySelector(e, t) {
            e = r.$(e)[0];
            e && r.$(e).val(t)
        }
        static getURLParameter(e) { return decodeURIComponent((RegExp("[?|&]" + e + "=(.+?)(&|$)", "i").exec(r.getLocationSearch()) || [, ""])[1]) } static getLocationSearch() { return location.search } static isIE() { return /msie|trident/i.test(window.navigator.userAgent) } setFieldsData(e) {
            for (var t in this.config.fields) {
                var i = this.config.fields[t];
                r.addFieldRecord(e, t, r.getElementValueBySelector(i))
            }
        }
        setContactFieldsData(e) {
            for (var t in this.config.contactFields) {
                var i = this.config.contactFields[t];
                e.contactFieldsData.push({ name: t, value: r.getElementValueBySelector(i) })
            }
        }
        transformObjectToArray(t) { return Object.keys(t).map(function(e) { return { name: e, value: t[e] } }) } getLandingData() {
            let e = [],
                t = (this.config.hasOwnProperty("customFields") && null !== this.config.customFields && (e = this.transformObjectToArray(this.config.customFields)), []);
            this.config.hasOwnProperty("trackingFields") && null !== this.config.trackingFields && (t = this.transformObjectToArray(this.config.trackingFields));
            var i = { formId: this.config.landingId, formFieldsData: e, contactFieldsData: t };
            return this.setFieldsData(i), this.config.hasOwnProperty("contactFields") && null !== this.config.contactFields && this.setContactFieldsData(i), r.setCookiesData(i), i
        }
        onError(e, t, i) { r.jQuery.isFunction(this.config.onError) && this.config.onError(e, t, i) } onComplete(e) { r.jQuery.isFunction(this.config.onComplete) && this.config.onComplete(e) } onSuccess(e) { r.jQuery.isFunction(this.config.onSuccess) && this.config.onSuccess(e) } onResponse(e) {
            var e = e.SaveWebFormLeadDataResult || e.SaveWebFormObjectDataResult;
            e && (e = r.parseResponse(e), this.config.onSuccess ? this.onSuccess(e) : 0 === e.resultCode && this.config.redirectUrl && this.redirect())
        }
        redirect() { window.location.href = this.config.redirectUrl } 

        createObjectFromLanding(e) {
            this.config = e;
            var t = { formData: this.getLandingData() };
            this.addContactRegistrationInfo(t.formData), r.jQuery.ajax({ url: e.serviceUrl, type: "POST", data: JSON.stringify(t), contentType: "application/json; charset=UTF-8", async: !0, crossDomain: !0, error: this.onError.bind(this), success: this.onResponse.bind(this), complete: this.onComplete.bind(this) })
        }
        addContactRegistrationInfo(e) { this.contactId.value && e.formFieldsData.push(this.contactId), this.bulkEmailRecipientId.value && e.formFieldsData.push(this.bulkEmailRecipientId) } createLeadFromLanding(e) { return console.warn('Method "createLeadFromLanding()" is obsolete. Use "createObjectFromLanding()"'), this.createObjectFromLanding(e) } initLanding(e) {
            if (!r.isIE())
                for (var t in e.fields) {
                    var i = r.getURLParameter(t.replace(".", "_"));
                    r.setElementValueBySelector(e.fields[t], i)
                }
        }
    }
    return new r(window.$)
})();