'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.globalController = void 0;
const globalController = props => {
  return (req, res, next) => {
    const html = (props === null || props === void 0 ? void 0 : props.html) || '<h1>outqource-node/express</h1>';
    const status = (props === null || props === void 0 ? void 0 : props.status) || 404;
    res.status(status).contentType('html').send(html);
  };
};
exports.globalController = globalController;
