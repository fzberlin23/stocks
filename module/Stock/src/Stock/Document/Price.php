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

	/** @ODM\Field(type="float") */
    public $open;

	/** @ODM\Field(type="float") */
    public $high;

	/** @ODM\Field(type="float") */
    public $low;

	/** @ODM\Field(type="float") */
    public $close;

	public function getId() {
		return $this->id;
	}

	public function getDate() {
		return $this->date;
	}

	public function getOpen() {
		return $this->open;
	}

	public function getHigh() {
		return $this->high;
	}

	public function getLow() {
		return $this->low;
	}

	public function getClose() {
		return $this->close;
	}

	public function setStock($stock) {
		$this->stock = $stock;
	}

	public function setDate($date) {
        $this->date = (string)$date;
    }

	public function setOpen($open) {
        $this->open = (float)$open;
    }

	public function setHigh($high) {
        $this->high = (float)$high;
    }

	public function setLow($low) {
        $this->low = (float)$low;
    }

	public function setClose($close) {
        $this->close = (float)$close;
    }

}