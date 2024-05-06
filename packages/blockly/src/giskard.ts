import * as Blockly from 'blockly';
import { pythonGenerator as BlocklyPy } from 'blockly/python';

BlocklyPy.INDENT  = '    ';

const giskard_colors = [
  "#FF5733", // Orange
  "#34A853", // Green
  "#4285F4", // Blue
  "#DB4437", // Red
  "#F7B733", // Yellow
  "#7B1FA2", // Purple
  "#FFA500", // Orange
  "#00796B", // Teal
  "#9C27B0", // Deep Purple
  "#2196F3"  // Indigo
];
/*
 * Block definitions
 */

const GISKARD_BLOCKS = [
  {
    // unique id of a type of block
    id: 'import_libs',
    // Function defines how the block will look like, the inputs, the fields, etc.
    // Docs: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#javascript_2
    block_init: function() {
      this.appendDummyInput()
        .appendField('Import libraries')
      this.setPreviousStatement(false, null)
      this.setNextStatement(true, null)
      this.setColour(giskard_colors[5])
      this.setTooltip('Import python libraries.')
      this.setHelpUrl('')
    },
    // The python code generator for the block
    generator: (block) => {
      let code = '\n'
      return code
    },
    // The python top-level code, for example import libraries
    toplevel_init: [
      `import rospy`,
      `from geometry_msgs.msg import, Point, Quaternion`,
      `from utils import *`,
    ].join('\n') + '\n\n'
  },
  {
    id: 'rospy_sleep',
    block_init: function() {
      this.appendValueInput('TIME')
        .setCheck('Number')
        .appendField('Wait for');
      this.appendDummyInput()
        .appendField('seconds');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setInputsInline(true);
      this.setColour(giskard_colors[1])
      this.setTooltip('Wait for a certain amount of time.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_time = BlocklyPy.valueToCode(block, 'TIME', BlocklyPy.ORDER_ATOMIC);
      let code = `rospy.sleep(${value_time})`;
      return code + '\n';
    }
  },
  {
    id: 'giskard_motion_goals_add_joint_position',
    block_init: function() {
      this.appendValueInput('JOINT_LIST')
        .setCheck('Array')
        .appendField('Add joint position motion goal with:');
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[9])
      this.setTooltip(
        'Giskard api: giskard_wrapper.motion_goals.add_joint_position'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_side = BlocklyPy.valueToCode(block, 'JOINT_LIST', BlocklyPy.ORDER_ATOMIC);
      let code = "add_joint_position(" + value_side + ")";
      return code + '\n';
    }
  },
  {
    id: 'giskard_joint_state',
    block_init: function() {
      this.appendValueInput("JOINT_NAME")
          .setCheck("String")
          .appendField("Joint");
      this.appendValueInput("POSITION")
          .setCheck("Number")
          .appendField("to ");
      this.setInputsInline(true);
      this.setOutput(true, "Dict");
      this.setColour(giskard_colors[4])
      this.setTooltip("Joint state.");
      this.setHelpUrl("");
    },
    generator: (block) => {
      let value_joint = BlocklyPy.valueToCode(block, 'JOINT_NAME', BlocklyPy.ORDER_ATOMIC) || '';
      let value_pos = BlocklyPy.valueToCode(block, 'POSITION', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `{${value_joint}: ${value_pos}}`;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'giskard_motion_goals_add_cartesian_pose',
    block_init: function() {
      this.appendDummyInput('')
        .appendField('Add cartesian pose motion goal with:');
      this.appendValueInput('TIP_LINK')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('tip_link');
      this.appendValueInput('ROOT_LINK')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('root_link');
      this.appendValueInput('FRAME_ID')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('frame_id');
      this.appendValueInput('POSITION')
        .setCheck('Point')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('position');
      this.appendValueInput('ORIENTATION')
        .setCheck('Quaternion')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('orientation');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setInputsInline(false);
      this.setColour(giskard_colors[9])
      this.setTooltip(
        'Giskard api: giskard_wrapper.motion_goals.add_cartesian_position'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_tip_link = BlocklyPy.valueToCode(block, 'TIP_LINK', BlocklyPy.ORDER_ATOMIC) || "'base_link'";
      let value_root_link = BlocklyPy.valueToCode(block, 'ROOT_LINK', BlocklyPy.ORDER_ATOMIC) || "'map'";
      let value_frame_id = BlocklyPy.valueToCode(block, 'FRAME_ID', BlocklyPy.ORDER_ATOMIC) || "'base_link'";
      let value_pos = BlocklyPy.valueToCode(block, 'POSITION', BlocklyPy.ORDER_ATOMIC) || 'None';
      let value_ori = BlocklyPy.valueToCode(block, 'ORIENTATION', BlocklyPy.ORDER_ATOMIC) || 'None';
      let code = `add_cartesian_pose(${value_pos}, ${value_ori}, root_link=${value_root_link}, tip_link=${value_tip_link}, frame_id=${value_frame_id})`;
      return code + '\n';
    }
  },
  {
    id: 'geometry_msgs_point',
    block_init: function() {
      this.appendValueInput('X')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('Point x')
      this.appendValueInput('Y')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('y');
      this.appendValueInput('Z')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('z');
      this.setOutput(true, 'Point');
      this.setColour(giskard_colors[4])
      this.setTooltip('Geometric primitive point.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_x = BlocklyPy.valueToCode(block, 'X', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_y = BlocklyPy.valueToCode(block, 'Y', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_z = BlocklyPy.valueToCode(block, 'Z', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `Point(${value_x}, ${value_y}, ${value_z})`;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },  
  {
    id: 'geometry_msgs_quaternion',
    block_init: function() {
      this.appendValueInput('X')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('Quaternion x')
      this.appendValueInput('Y')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('y');
      this.appendValueInput('Z')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('z');
      this.appendValueInput('W')
        .setCheck('Number')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('w');
      this.setOutput(true, 'Quaternion');
      this.setColour(giskard_colors[4])
      this.setTooltip('Geometric primitive Quaternion.');
      this.setHelpUrl('');
    },
    generator: (block) => {
      let value_x = BlocklyPy.valueToCode(block, 'X', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_y = BlocklyPy.valueToCode(block, 'Y', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_z = BlocklyPy.valueToCode(block, 'Z', BlocklyPy.ORDER_ATOMIC) || 0;
      let value_w = BlocklyPy.valueToCode(block, 'W', BlocklyPy.ORDER_ATOMIC) || 0;
      let code = `Quaternion(${value_x}, ${value_y}, ${value_z}, ${value_w})`;
      // return code;
      return [code, BlocklyPy.ORDER_ATOMIC];
    }
  },
  {
    id: 'giskard_joint_trajectory_controller',
    block_init: function() {
      this.appendDummyInput('')
        .appendField('Display joint trajectory controller');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(giskard_colors[7])
      this.setTooltip(
        'Display joint_trajectory_controller'
      );
      this.setHelpUrl('');
    },
    generator: (block) => {
      let code = "display_joint_trajectory_controller()";
      return code + '\n';
    }
  },
  {
    id: 'arbitrary_code',
    block_init: function() {
      this.appendDummyInput()
        .appendField("Arbitrary python code")
        .appendField(new Blockly.FieldMultilineInput('# ========= Embed code ========= # \n\n\n\n\n# ========= End ========= #'),
            'PYTHON_CODE');
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(giskard_colors[8])
      this.setTooltip('Embed arbitrary python code, for testing.')
    },
    generator: (block) => {
      let code = block.getFieldValue('PYTHON_CODE')
      return code + '\n';
    }
  }
]

// Registering the custom blocks and their generators in blockly
for (const blocks of GISKARD_BLOCKS) {
  Blockly.Blocks[blocks.id] = {
    init: blocks.block_init
  };

  BlocklyPy[blocks.id] = blocks.generator;
  if (blocks.toplevel_init) {
    Blockly.Blocks[blocks.id].toplevel_init = blocks.toplevel_init;
  }
}

// Creating a toolbox extends the base blocks toolbox by adding the custom blocks
export default {
  kind: 'CATEGORY',
  colour: giskard_colors[0],
  name: 'Robotics',
  contents: GISKARD_BLOCKS.map(v => {
    return {
      kind: 'BLOCK',
      type: v.id
    }
  })
}
