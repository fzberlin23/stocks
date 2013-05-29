<?php
namespace Stock\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/** @ODM\Document(collection="prices") */
class Price
{

    /** @ODM\Id */
    public $id;

	/** @ODM\ReferenceOne(targetDocument="Stock") */
	private $stock;

	/** @ODM\Field(type="string") */
    public $date;

	public function getId() {
		return $this->id;
	}

	public function setStock($stock) {
		$this->stock = $stock;
	}

	public function setDate($date) {
        $this->date = $date;
    }

}