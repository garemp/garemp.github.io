;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.hovers');

  /**
   * This hover renderer will basically display the label with a background.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.hovers.def = function(node, context, settings) {
    var x,
        y,
        w,
        h,
        e,
        fontStyle = settings('hoverFontStyle') || settings('fontStyle'),
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        fontSize = (settings('labelSize') === 'fixed') ?
          settings('defaultLabelSize') :
          settings('labelSizeRatio') * size;

    // Label background:
    context.font = (fontStyle ? fontStyle + ' ' : '') +
      fontSize + 'px ' + (settings('hoverFont') || settings('font'));

    context.beginPath();
    context.fillStyle = settings('labelHoverBGColor') === 'node' ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultHoverLabelBGColor');

    if (node.label && settings('labelHoverShadow')) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = settings('labelHoverShadowColor');
    }

    if (node.label && typeof node.label === 'string') {
      // x = Math.round(node[prefix + 'x'] - fontSize / 2 - 2);
      // y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2);
      x = Math.round(node[prefix + 'x'] - context.measureText(node.label).width / 2 - 7);
      y = Math.round(node[prefix + 'y'] - fontSize / 2 - 2 + node.dy);
      w = Math.round(
        // context.measureText(node.label).width + fontSize / 2 + size + 7
        context.measureText(node.label).width + fontSize / 2
      );
      h = Math.round(fontSize + 4);
      e = Math.round(fontSize / 2 + 2);

      context.moveTo(x, y + e);
      context.arcTo(x, y, x + e, y, e);
      context.lineTo(x + w / 2, y);
      context.lineTo(x + w / 2, y + h);
      context.lineTo(x + e, y + h);
      context.arcTo(x, y + h, x, y + h - e, e);
      context.lineTo(x, y + e);

      context.closePath();
      context.fillStyle = node.colorf;
      context.fill();

      context.beginPath();
      context.moveTo(x + w / 2, y);
      context.lineTo(x + w, y);
      context.arcTo(x + w + e, y, x + w + e, y + e, e);
      context.arcTo(x + w + e, y + h, x + w, y + h, e);
      // context.lineTo(x + w, y + h);
      context.lineTo(x + w / 2, y + h);
      context.lineTo(x + w / 2, y);

      context.closePath();
      context.fillStyle = node.colorg;
      context.fill();

      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 0;
    }

    // Node border:
    if (settings('borderSize') > 0) {
      context.beginPath();
      context.fillStyle = settings('nodeBorderColor') === 'node' ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultNodeBorderColor');
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        size + settings('borderSize'),
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.fill();
    }

    // Node:
    var nodeRenderer = sigma.canvas.nodes[node.type] || sigma.canvas.nodes.def;
    nodeRenderer(node, context, settings);

    // Display the label:
    if (node.label && typeof node.label === 'string') {
      context.fillStyle = (settings('labelHoverColor') === 'node') ?
        (node.color || settings('defaultNodeColor')) :
        settings('defaultLabelHoverColor');

      context.fillText(
        node.label,
        // Math.round(node[prefix + 'x'] + size + 3),
        // Math.round(node[prefix + 'y'] + fontSize / 3)
        Math.round(node[prefix + 'x'] - context.measureText(node.label).width / 2),
        Math.round(node[prefix + 'y'] + fontSize / 3 + node.dy)
        );
    }
  };
}).call(this);
