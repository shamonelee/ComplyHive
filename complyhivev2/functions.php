<?php
/**
 * ComplyHive V2 — Functions
 */

/* =========================
   Google Fonts
   ========================= */
function complyhivev2_enqueue_fonts() {
    wp_enqueue_style(
        'complyhivev2-google-fonts',
        'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Exo+2:wght@600;700;800&family=Figtree:wght@400;500;600&display=swap',
        array(),
        null
    );
}
add_action('wp_enqueue_scripts', 'complyhivev2_enqueue_fonts');
add_action('enqueue_block_editor_assets', 'complyhivev2_enqueue_fonts');


/* =========================
   Site CSS
   ========================= */
function complyhivev2_enqueue_site_css() {
    $css_path = get_template_directory() . '/assets/css/site.css';
    $css_url  = get_template_directory_uri() . '/assets/css/site.css';

    wp_enqueue_style(
        'complyhivev2-site',
        $css_url,
        array(),
        file_exists($css_path) ? filemtime($css_path) : '1.2.1'
    );
}
add_action('wp_enqueue_scripts', 'complyhivev2_enqueue_site_css');


/* =========================
   Hero JS
   ========================= */
function complyhivev2_enqueue_hero_js() {
    $js_path = get_template_directory() . '/assets/js/hero.js';
    if (!file_exists($js_path)) return;

    wp_enqueue_script(
        'complyhivev2-hero',
        get_template_directory_uri() . '/assets/js/hero.js',
        array(),
        filemtime($js_path),
        true
    );
}
add_action('wp_enqueue_scripts', 'complyhivev2_enqueue_hero_js');
