/*
 * Example:
 *
    <form class="reveal-fields">
      <input type="checkbox" data-reveal=".more-fields">
      <div class="more-fields">
        ...
      </div>
    </form>

    $('.reveal-fields').revealFields( options );
 *
 */

// @todo <select> menus still need work

define([
  'jquery'
],

function($) {

  'use strict';

  (function($, undefined){

    $.fn.revealFields = function( options ) {

      var _defaults = {
        context: '[data-parent]',
        selector: '[data-reveal]',
        success: function(){}
      };

      options = $.extend( _defaults, options );

      function _selected( input ) {

        var $input = ( input instanceof jQuery ) ? input : $(input);

        // test for select
        if ( $input.is('select') ) {
          // Test if the selected option is empty
          return $input.val() !== '' // && $input.find(':first-child').attr('disabled') === undefined;
        }

        // test for radio or checkbox
        else if ( $input.is(':radio, :checkbox') ) {
          return $input.is(':checked')
        }

        // must be a text field
        else {
          // test if value is empty
          return $input.val() !== '';
        }

      };

      function _getTargets( $inputs ) {

        var targets = {},
            values  = [];

        $inputs.each(function(i, input){

          var $input = $( input ),
              name   = $input.attr('name'),
              target = $input.data('reveal');

          if ( $input.is('option') )
            name = $input.parent().attr('name');

          if ( name && target ) {

            if ( !values[ name ] )
              values[ name ] = [];

            values[ name ].push( target );
            targets[ name ] = values[ name ];

          }

        });

        return targets;

      }

      function _bindInputs( $context, $inputs ){

        var targets = _getTargets( $inputs );

        $context.on('change', 'input, select', function(e){

          var $target, hideAll, $hideAll;

          var $this    = $( this ),
              name     = $this[0].name,
              target   = $this.data( 'reveal' ),
              target_i = $.inArray( target, targets[name] ),
              selected = _selected( $this ),
              match    = ( target_i >= 0 ) ? true : false;

          // if there are no targets, stop here.
          if ( !targets[name] )
            return;

          // @todo splice (remove) current target from array
          // so it is not hidden then revealed if a match is found
          hideAll  = targets[ name ].join(', ');
          $hideAll = $context.find( hideAll );

          // for now, set all targets to hidden
          $hideAll.addClass( 'hide' );

          // reveal matching and selected targets
          if ( targets[name] && match && selected ) {
            $target = $context.find( target );
            $target.removeClass('hide');
          }

          // @todo store field values, then clear
          // @todo on show, repopulate field values
          // @todo unhide selected targets on load

          // @todo fire event callback

        });

      };


      return this.each(function(){

        var $this   = $( this ),
            $inputs = $this.find( 'input, select option' );

        // test for selectors in the context
        if ( $inputs.length )
          _bindInputs( $this, $inputs );

      });

    };

  })($);

});
