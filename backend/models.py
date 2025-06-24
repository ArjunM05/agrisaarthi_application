from config import db

class Pest(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(100),unique=True,nullable=False)
    description=db.Column(db.Text,nullable=True)
    crop_affected=db.Column(db.String(100),nullable=True)

    def __repr__(self):
        return f'<Pest {self.name}'
    def to_json(self):
        return {
            'id':self.id,
            'name':self.name,
            'description':self.description,
            'cropAffected':self.crop_affected
        }