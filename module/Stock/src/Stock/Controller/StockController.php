<?php
namespace Stock\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class StockController extends AbstractActionController
{

	protected $stockTable;

	public function homeAction()
	{
	}

	public function indexAction()
    {
//        return new ViewModel(array(
//            'stocks' => $this->getStockTable()->fetchAll(),
//        ));
    }

	public function easeljsAction()
	{
	}

	public function getStockTable()
    {
        if (!$this->stockTable) {
            $sm = $this->getServiceLocator();
            $this->stockTable = $sm->get('Stock\Model\AlbumTable');
        }
        return $this->stockTable;
    }

}