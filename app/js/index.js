(function() {
  // Mobile menu toggle functionality
  $('#toggle-nav').on('click', function() {
    $('#nav-list').slideToggle();
  });

  // Photo overlay functionality
  var height = $(document).height();

  $('#overlay').css('height', height);
  $('.overlay__close').on("click", function() {
    $("#overlay").fadeOut(200);
  });
  $("#toggle-overlay").on("click", function() {
    $("#overlay").css('display', 'flex').fadeIn();
  });
})();