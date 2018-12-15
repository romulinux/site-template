var floating_element = (selector) =>
{
  var child = $(selector);
  var parent = child.parent();
  var sibling = $(selector).prev().height() > $(selector).next().height()? $(selector).prev() : $(selector).next();
  var parent_os_top = parent.offset().top;
  var sibling_offset_top = sibling.offset().top;
  var parent_h = parent.height();
  var sibling_height = sibling.height();
  var child_height = child.height();
  $(window).scroll(function () {
    var new_child_margin_top = 0;
    var st = $(this).scrollTop();
    if (st > sibling_offset_top) {
      if(st < ((sibling_offset_top + sibling_height) + child_height)) {
        new_child_margin_top = st - sibling_offset_top;
      } else {
        new_child_margin_top = sibling_offset_top + sibling_height - child_height;
      }
    } else {
      new_child_margin_top = 0;
    }
    if(st + child_height >= sibling_offset_top + sibling_height) {
      new_child_margin_top = sibling_height - child_height - parent_os_top;
    }
    child.css('margin-top', new_child_margin_top);
  });
}

var taller_sibling = (element) =>
{
  siblings = element.siblings();
  var taller = siblings[0];
  var i = 1;
  for(i = 1; i < siblings.lenght; i++) {
    if(siblings[i].height() > taller.height()) {
      taller = siblings[i];
    }
  }
  return taller;
}
var scrolling = (selector) =>
{
  $(selector).on('click', function () {
    var l = $($(this).attr('href'));
    l[0].scrollIntoView({
      block: "start",
      behavior: "instant"
    });
  });
}
var selector = '.child';
floating_element(selector);
selector = '.sibling__nav-item';
scrolling(selector);