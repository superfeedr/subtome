<?php
/*
Plugin Name: SubToMe
Plugin URI: http://www.subtome.com/
Description: A plugin to integrate a SubToMe button to your blog. This button is a universal subscribe button and will let your readers pick the subscription tool of their choice.
Version: 1.4
Author: Julien Genestoux
Author URI: http://superfeedr.com/
Author Email: julien@superfeedr.com
Text Domain: subtome
Domain Path: /lang/
Network: false
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Copyright 2013 Superfeedr (julien@superfeedr.com)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

class SubToMeWidget extends WP_Widget {

	/*--------------------------------------------------*/
	/* Constructor
	/*--------------------------------------------------*/

	/**
	 * Specifies the classname and description, instantiates the widget,
	 * loads localization files, and includes necessary stylesheets and JavaScript.
	 */
	public function __construct() {

    // load plugin text domain
    add_action( 'init', array( $this, 'widget_textdomain' ) );

		parent::__construct(
			'subtome',
			__( 'SubToMe' ),
			array(
				'classname'		=>	'widget_subtome',
				'description'	=>	__( 'Universal Subscribe Button.', 'subtome' )
			)
		);

	} // end constructor

	/*--------------------------------------------------*/
	/* Widget API Functions
	/*--------------------------------------------------*/

	/**
	 * Outputs the content of the widget.
	 *
	 * @param	array	args		The array of form elements
	 * @param	array	instance	The current instance of the widget
	 */
	public function widget( $args, $instance) {

		extract( $args, EXTR_SKIP );

    $title = empty( $instance['title'] ) ? '' : $instance['title'];
    $caption = empty( $instance['caption'] ) ? 'Subscribe' : $instance['caption'];

		echo $before_widget;
		if ( $title )
			echo $before_title . $title . $after_title;
    ?>
    <input type="button" onclick="(function(){var z=document.createElement('script');z.src='https://www.subtome.com/load.js';document.body.appendChild(z);})()" value="<?php echo $caption; ?>">

    <?php
		echo $after_widget;

	} // end widget

	/**
	 * Processes the widget's options to be saved.
	 *
	 * @param	array	new_instance	The previous instance of values before the update.
	 * @param	array	old_instance	The new instance of values to be generated via the update.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

  	$instance['title'] = attribute_escape($new_instance['title']);
    $instance['caption'] = attribute_escape($new_instance['caption']);

		return $instance;

	} // end widget

	/**
	 * Generates the administration form for the widget.
	 *
	 * @param	array	instance	The array of keys and values for the widget.
	 */
	public function form( $instance ) {
		$instance = wp_parse_args((array) $instance, array('title' => 'SubToMe', 'caption' => 'Subscribe'));

    $title = strip_tags($instance['title']);
    $caption = strip_tags($instance['caption']);
    ?>
    <p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'subtome'); ?></label> <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>" /></p>
    <p><label for="<?php echo $this->get_field_id('caption'); ?>"><?php _e('Caption:', 'subtome'); ?></label> <input class="widefat" id="<?php echo $this->get_field_id('caption'); ?>" name="<?php echo $this->get_field_name('caption'); ?>" type="text" value="<?php echo esc_attr($caption); ?>" /></p>
    <?php
	} // end form

  /**
   * Loads the Widget's text domain for localization and translation.
   */
  public function widget_textdomain() {
  	load_plugin_textdomain( 'subtome', false, plugin_dir_path( __FILE__ ) . '/lang/' );
	} // end widget_textdomain

} // end class
add_action( 'widgets_init', create_function( '', 'register_widget("SubToMeWidget");' ) );

class SubToMePlugin {

  /**
   * adds a "subtome" shortcode
   *
   * @param array $atts
   * @return string
   */
  function shortcode( $atts ) {
  	extract( shortcode_atts( array(
  		'caption' => 'Subscribe'
  	), $atts ) );

  	return "<input type=\"button\" onclick=\"(function(){var z=document.createElement('script');z.src='https://www.subtome.com/load.js';document.body.appendChild(z);})()\" value=\"$caption\">";
  }

  /**
   * adds a link to the "meta" widget
   */
  function meta_link() {
  	echo "<li><a href=\"#\" onclick=\"(function(){var z=document.createElement('script');z.src='https://www.subtome.com/load.js';document.body.appendChild(z);})(); return false;\">Subscribe</a></li>";
  }
}

add_shortcode( 'subtome', array( 'SubToMePlugin', 'shortcode' ) );
add_action( 'wp_meta', array( 'SubToMePlugin', 'meta_link' ) );
