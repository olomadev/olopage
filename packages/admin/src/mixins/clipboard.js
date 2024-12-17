import Clipboard from "clipboard";

/**
 * Clipboard function
 */
export default {
  inject: ['i18n'],
  props: {},
  created() {

    const copyCode = new Clipboard('.btn-copy', {
      target: (trigger) => {
        return trigger.nextElementSibling;
      }
    });
    let Self = this;
    copyCode.on('success', function(event) {
        event.clearSelection();
        event.trigger.textContent = Self.i18n.global.t("va.actions.copied");
        window.setTimeout(function() {
            event.trigger.textContent = Self.i18n.global.t("va.actions.copy");
        }, 2300);
    });
    copyCode.on('error', function(event) { 
        console.error(event);
        event.trigger.textContent = Self.i18n.global.t("va.actions.copyNotSupported");
        window.setTimeout(function() {
            event.trigger.textContent = Self.i18n.global.t("va.actions.copy");
        }, 2000);
    });    
  }
};
