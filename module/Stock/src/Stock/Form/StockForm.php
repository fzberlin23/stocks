<?php
	namespace Stock\Form;

	use Zend\Form\Form;

	class StockForm extends Form
	{
		public function __construct($name = null)
		{
			// we want to ignore the name passed
			parent::__construct('stock');
			$this->setAttribute('method', 'post');
			$this->add(array(
				'name' => 'id',
				'type' => 'Hidden',
			));
			$this->add(array(
				'name' => 'symbol',
				'type' => 'Text',
				'options' => array(
					'label' => 'Symbol',
				),
			));
			$this->add(array(
				'name' => 'submit',
				'type' => 'Submit',
				'attributes' => array(
					'value' => 'Go',
					'id' => 'submitbutton',
				),
			));
		}
	}