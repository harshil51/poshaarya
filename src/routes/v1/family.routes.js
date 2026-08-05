const express = require('express');
const router = express.Router();

const familyController = require('../../controllers/family/family.controller');
const { authenticate } = require('../../middlewares/authenticate');
const validate = require('../../middlewares/validate');
const {
  createFamilyGroupSchema,
  updateFamilyGroupSchema,
  addFamilyMemberSchema,
  paramsIdSchema,
  removeMemberParamsSchema,
} = require('../../validators/family/family.validator');

router.use(authenticate);

router.get('/', familyController.getMyGroups);
router.post('/', validate(createFamilyGroupSchema), familyController.createGroup);

router.get('/:id', validate(paramsIdSchema, 'params'), familyController.getGroupById);
router.patch('/:id', validate(updateFamilyGroupSchema), familyController.updateGroup);
router.delete('/:id', familyController.deleteGroup);

router.get('/:id/members', validate(paramsIdSchema, 'params'), familyController.getMembers);
router.post('/:id/members', validate(addFamilyMemberSchema), familyController.addMember);
router.delete('/:id/members/:userId', validate(removeMemberParamsSchema, 'params'), familyController.removeMember);

module.exports = router;
