<?php
return array(
    'controllers' => array(
        'invokables' => array(
            'Stock\Controller\Stock' => 'Stock\Controller\StockController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'stock' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/stock[/][:action][/:id]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[a-z0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Stock\Controller\Stock',
                        'action'     => 'index',
                    ),
                ),
            ),
        ),
    ),

    'view_manager' => array(
        'template_path_stack' => array(
            'stock' => __DIR__ . '/../view',
        ),
    ),
);