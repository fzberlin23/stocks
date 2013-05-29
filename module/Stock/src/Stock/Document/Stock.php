<?php
namespace Stock\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/** @ODM\Document(collection="stocks") */
class Stock
{

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

}