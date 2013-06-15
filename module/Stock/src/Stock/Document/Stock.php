<?php
namespace Stock\Document;

use Zend\InputFilter\Factory as InputFactory;
use Zend\InputFilter\InputFilter;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/** @ODM\Document(collection="stocks") */
class Stock
{

	protected $inputFilter;

    /** @ODM\Id */
    public $id;

    /** @ODM\Field(type="string") */
    public $symbol;

	/**
     * @param field_type $symbol
     */
    public function setSymbol($symbol) {
        $this->symbol = $symbol;
    }

	public function getId() {
		return $this->id;
	}

	public function exchangeArray($data)
	{
		$this->id     = (isset($data['id'])) ? $data['id'] : null;
		$this->symbol = (isset($data['symbol'])) ? $data['symbol'] : null;
	}

	public function getInputFilter()
	{
		if (!$this->inputFilter) {
			$inputFilter = new InputFilter();
			$factory     = new InputFactory();

			$inputFilter->add($factory->createInput(array(
				'name'     => 'id',
				'required' => true,
				'filters'  => array(
					array('name' => 'Int'),
				),
			)));

			$inputFilter->add($factory->createInput(array(
				'name'     => 'symbol',
				'required' => true,
				'filters'  => array(
					array('name' => 'StripTags'),
					array('name' => 'StringTrim'),
				),
				'validators' => array(
					array(
						'name'    => 'StringLength',
						'options' => array(
							'encoding' => 'UTF-8',
							'min'      => 1,
							'max'      => 100,
						),
					),
				),
			)));

			$this->inputFilter = $inputFilter;
		}

		return $this->inputFilter;
	}

}