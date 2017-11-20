
const model = require('./../../../model')
const express = require('express')
const router = express.Router()
const service = require('../service')

const controller = require('./controller')

/** @api {delete} /doc/:doc_key 문서 삭제
 * @apiParam {Number} type 종류
 * 
 * @apiName docDelete
 * @apiGroup Document
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 * 1
 * }
 */
router.delete('/:doc_key', controller.docDelete)

/** @api {get} /doc/ 문서 리스트
 * 
 * @apiName listData
 * @apiGroup Document
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [{Doc}]
 */
router.get('/', controller.listData)

/** @api {get} /doc/qna 질문답변 리스트
 * 
 * @apiName qnaListData
 * @apiGroup Document
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * [{Doc}]
 */
router.get('/qna', controller.qnaListData)

/** 도큐먼트 리스트 조회
 * @api {get} /doc/front 도큐먼트 리스트 조회
 * @apiVersion 0.0.1
 * @apiName getFrontDocuments
 * @apiGroup Document
 *
 * @apiParam {Number} type 도큐먼트의 타입을 넘겨준다.
 *
 * @apiSuccess {Number} count 총 도큐먼트의 갯수.
 * @apiSuccess {Document[]} raws  도큐먼트 리스트.
 *
 */
router.get('/front', controller.getFrontDocuments)

/** 피드 등록
 * @api {post} /doc/front 피드 등록
 * @apiParam {Number} activity_key 액티비티 키
 * @apiParam {Number} activity_title 제목
 * @apiParam {Number} activity_rating 별점
 * @apiParam {String} content 내용
 * @apiParam {Array} image_url 이미지
 * @apiParam {Json} medias 미디어
 * @apiParam {Number} type 타입
 * @apiParam {Boolean} private_mode 비공개
 * @apiParam {Number} status 상태
 * 
 * @apiVersion 0.0.1
 * @apiName postDocuments
 * @apiGroup Document
 */
router.post('/front', service.authChk, controller.postDocuments)

/** 도큐먼트 검색
 * @api {get} /doc/front/search 도큐먼트 리스트 조회
 * @apiParam {String} hash 해시태그
 * @apiVersion 0.0.1
 * @apiName searchDocuments
 * @apiGroup Document
 */
router.get('/front/search', controller.searchDocuments)

/** 도큐먼트 검색
 * @api {get} /doc/front/user/:user_key 유저 도큐먼트
 * @apiParam {String} user_key 유저키
 * @apiVersion 0.0.1
 * @apiName getUsersDocuments
 * @apiGroup Document
 */
router.get('/front/user/:user_key', controller.getUsersDocuments)

router.get('/front/:doc_key', controller.documentsDetail)

router.put('/front/:doc_key', service.authChk, controller.putDocuments)

router.delete('/front/:doc_key', service.authChk, controller.deleteDocuments)

router.get('/front/:doc_key/comment', controller.getComments)

router.post('/front/:doc_key/comment', service.authChk, controller.postComment)

router.put('/front/:doc_key/comment/:comment_key', service.authChk, controller.putComment)

router.delete('/front/:doc_key/comment/:comment_key', service.authChk, controller.deleteComment)

router.get('/front/:doc_key/like', controller.getLikes)

router.get('/front/:doc_key/like', controller.getLikes)

router.get('/share/:doc_key', 
  function (req, res, next) {
    model.Doc.increment('share_count', { where: { doc_key: req.params.doc_key} })
      .then(result => {
        res.json({ message: 'success', data: result })
      })
      .catch(error => next(error))
  }
)



module.exports = router
