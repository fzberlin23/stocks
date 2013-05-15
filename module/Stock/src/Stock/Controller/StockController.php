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

		$dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

        $stocks = $dm->createQueryBuilder('Stock\Document\Stock')
			->getQuery()
			->execute();

        return new ViewModel(array(
           'stocks' => $stocks,
        ));
    }

	public function easeljsAction()
	{
	}

}