
const model = require('./../../../model')
const express = require('express')
const router = express.Router()
const service = require('../service')

const controller = require('./controller')

router.delete('/:doc_key', controller.docDelete)

router.get('/', controller.listData)

router.get('/qna', controller.qnaListData)

/** @api {get} /doc/front 피드 목록
 * 
 * @apiName getFrontDocuments
 * @apiGroup doc
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    results: [ {{ docLIST }} ]
 * }
 */
router.get('/front', controller.getFrontDocuments)

/** @api {post} /doc/front 피드 작성
 * 
 * @apiName postDocuments
 * @apiGroup doc
 * @apiParam {Number} activity_key 엑티비티 키
 * @apiParam {String} activity_title 엑티비티 제목
 * @apiParam {Number} activity_rating 후기점수
 * @apiParam {String} content 내용
 * @apiParam {String} image_url 이미지 url
 * @apiParam {String} medias 영상 url
 * @apiParam {Number} host_key 호스트 키
 * @apiParam {Number} type 독 타입
 * @apiParam {Boolean} private_mode 공개여부
 * @apiParam {Number} status 독 상태
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    docDATA
 * }
 */
router.post('/front', service.authChk, controller.postDocuments)

/** @api {get} /doc/front/search 해쉬태그 검색
 * 
 * @apiName searchDocuments
 * @apiGroup doc
 * @apiParam {String} hash 해쉬태그
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    results: [ {{ docLIST }} ]
 * }
 */
router.get('/front/search', controller.searchDocuments)

/** @api {get} /doc/front/user/:user_key 특정유저 독검색
 * 
 * @apiName getUserDocuments 
 * @apiGroup doc
 * @apiParam {Number} user_key 유저키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    results: [ {{ docLIST }} ]
 * }
 */
router.get('/front/user/:user_key', controller.getUsersDocuments)

router.get('/front/:doc_key', controller.documentsDetail)

/** @api {put} /doc/front/:doc_key 독 수정
 * 
 * @apiName putDocuments 
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키 
 * @apiParam {String} params 독 생성과 동일
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    {{ docDATA }}
 * }
 */
router.put('/front/:doc_key', service.authChk, controller.putDocuments)

/** @api {delete} /doc/front/:doc_key 독 삭제
 * 
 * @apiName deleteDocuments 
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    {{ docDATA }}
 * }
 */
router.delete('/front/:doc_key', service.authChk, controller.deleteDocuments)

/** @api {get} /doc/front/:doc_key/comment 해당 독 코멘트
 * 
 * @apiName getComments 
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "count": [
 *         {
 *             "count": "1"
 *         },
 *         {
 *             "count": "1"
 *         },
 *         {
 *             "count": "1"
 *         }
 *     ],
 *     "rows": [
 *         {
 *             "comment_key": 122,
 *             "user_key": 37,
 *             "doc_key": 300,
 *             "content": "서바이벌 양궁 재미있겠네요~",
 *             "user_name": "유니",
 *             "user_profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F20%2F21323.png?alt=media",
 *             "created_at": "2017-08-30T02:45:27.321Z",
 *             "updated_at": "2017-08-30T02:45:27.321Z",
 *             "like_count": "0"
 *         },
 *         {
 *             "comment_key": 120,
 *             "user_key": 1,
 *             "doc_key": 300,
 *             "content": "한은혜 위키너님 정말 헝거게임의 주인공 같네요~!!",
 *             "user_name": "위킨",
 *             "user_profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F11%2F50392.png?alt=media",
 *             "created_at": "2017-08-29T00:33:22.000Z",
 *             "updated_at": "2017-08-29T00:33:22.000Z",
 *             "like_count": "0"
 *         },
 *         {
 *             "comment_key": 119,
 *             "user_key": 232,
 *             "doc_key": 300,
 *             "content": "오오~~사진이 정말 멋지게 나왔어요 ",
 *             "user_name": "승연",
 *             "user_profile_image": "https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/img%2Fimage730%2F2017%2F7%2F29%2F27623.png?alt=media",
 *             "created_at": "2017-08-28T23:42:12.743Z",
 *             "updated_at": "2017-08-28T23:42:12.743Z",
 *             "like_count": "0"
 *         }
 *     ]
 * }
 */
router.get('/front/:doc_key/comment', controller.getComments)

/** @api {post} /doc/front/:doc_key/comment 코멘트 작성
 * 
 * @apiName postComment 
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키
 * @apiParam {String} content 내용
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    CommentDATA
 * }
 */
router.post('/front/:doc_key/comment', service.authChk, controller.postComment)

/** @api {put} /doc/front/:doc_key/comment/:comment 코멘트 작성
 * 
 * @apiName putComment
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키
 * @apiParam {String} content 내용
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * { 
 *    CommentDATA
 * }
 */
router.put('/front/:doc_key/comment/:comment_key', service.authChk, controller.putComment)

router.delete('/front/:doc_key/comment/:comment_key', service.authChk, controller.deleteComment)

/** @api {get} /doc/front/:doc_key/like 독 좋아요 조회
 * 
 * @apiName getLikes 
 * @apiGroup doc
 * @apiParam {Number} doc_key 독 키
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *     "count": 12,
 *     "rows": [
 *         {
 *             "like_key": 1007,
 *             "user_key": 218,
 *             "doc_key": 300,
 *             "comment_key": null,
 *             "news_key": null,
 *             "created_at": "2017-10-18T00:09:35.424Z",
 *             "updated_at": "2017-10-18T00:09:35.424Z"
 *         },
 *         {
 *             "like_key": 988,
 *             "user_key": 462,
 *             "doc_key": 300,
 *             "comment_key": null,
 *             "news_key": null,
 *             "created_at": "2017-10-13T16:37:18.148Z",
 *             "updated_at": "2017-10-13T16:37:18.148Z"
 *         }, ...
 *     ]
 * }
 */
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
